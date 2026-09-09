import { describe, it } from 'node:test';
import assert from 'node:assert';
import { hydrateState, serializeState } from '../src/lib/persistence.ts';

// Simple mock for localStorage since we're in node test env
global.localStorage = {
	data: {},
	getItem(key) { return this.data[key] || null; },
	setItem(key, val) { this.data[key] = String(val); },
	removeItem(key) { delete this.data[key]; },
	clear() { this.data = {}; }
} as any;

// A simplified simulation of what we did in weeklist.ts
function getWeeklistData() {
	const raw = localStorage.getItem('ost_weeklist');
	return raw ? JSON.parse(raw) : { currentWeek: Array.from({length:7},()=>[]), nextWeek: Array.from({length:7},()=>[]) };
}
function saveWeeklistData(d) {
	localStorage.setItem('ost_weeklist', JSON.stringify(d));
}

function getTimerState() {
	const raw = localStorage.getItem('ost_state');
	return hydrateState(raw, Date.now());
}
function saveTimerState(s) {
	localStorage.setItem('ost_state', serializeState(s));
}

function initMockTimer() {
	saveTimerState({
		mode: 'timer',
		style: 'modern',
		size: 'mid',
		soundEnabled: false,
		timer: { status: 'idle', initialDurationSeconds: 0, remainingMs: 0, targetEndTime: null },
		stopwatch: { status: 'idle', accumulatedMs: 0, startTime: null },
		tasks: [],
		activeSessionEngine: null,
		todoMinimized: false,
		clockFormat: '24h',
		activePresetId: null,
		activeSegmentIndex: 0
	});
}

describe('Weeklist Logic', () => {
	it('data structure and swap weeks preserves linkage', () => {
		localStorage.clear();
		let wd = getWeeklistData();
		assert.strictEqual(wd.currentWeek.length, 7);
		assert.strictEqual(wd.nextWeek.length, 7);

		wd.currentWeek[0].push({ id: 'w1', text: 'Task 1', timerTaskId: 't1' });
		saveWeeklistData(wd);

		// Swap
		let w2 = getWeeklistData();
		const temp = w2.currentWeek;
		w2.currentWeek = w2.nextWeek;
		w2.nextWeek = temp;
		saveWeeklistData(w2);

		let w3 = getWeeklistData();
		assert.strictEqual(w3.currentWeek[0].length, 0);
		assert.strictEqual(w3.nextWeek[0].length, 1);
		assert.strictEqual(w3.nextWeek[0][0].timerTaskId, 't1');
	});

	it('derived status logic and stale linkage cleaning', () => {
		localStorage.clear();
		initMockTimer();

		let timerState = getTimerState()!;
		timerState.tasks.push({ id: 't1', text: 'Task 1', status: 'pending', elapsedMs: 0, startTime: null });
		timerState.tasks.push({ id: 't2', text: 'Task 2', status: 'current', elapsedMs: 0, startTime: null });
		timerState.tasks.push({ id: 't3', text: 'Task 3', status: 'completed', elapsedMs: 0, startTime: null });
		saveTimerState(timerState);

		let wd = getWeeklistData();
		wd.currentWeek[0].push({ id: 'w1', text: 'Task 1', timerTaskId: 't1' });
		wd.currentWeek[1].push({ id: 'w2', text: 'Task 2', timerTaskId: 't2' });
		wd.currentWeek[2].push({ id: 'w3', text: 'Task 3', timerTaskId: 't3' });
		wd.currentWeek[3].push({ id: 'w4', text: 'Task 4', timerTaskId: 't99' }); // stale
		wd.currentWeek[4].push({ id: 'w5', text: 'Task 5', timerTaskId: null }); // unsent
		saveWeeklistData(wd);

		// clean stale
		let wData = getWeeklistData();
		let changed = false;
		for (const week of [wData.currentWeek, wData.nextWeek]) {
			for (const day of week) {
				for (const task of day) {
					if (task.timerTaskId && !timerState.tasks.find((t) => t.id === task.timerTaskId)) {
						task.timerTaskId = null;
						changed = true;
					}
				}
			}
		}
		if (changed) saveWeeklistData(wData);

		let finalW = getWeeklistData();
		assert.strictEqual(finalW.currentWeek[0][0].timerTaskId, 't1'); // pending
		assert.strictEqual(finalW.currentWeek[1][0].timerTaskId, 't2'); // current
		assert.strictEqual(finalW.currentWeek[2][0].timerTaskId, 't3'); // completed
		assert.strictEqual(finalW.currentWeek[3][0].timerTaskId, null); // stale cleaned
		assert.strictEqual(finalW.currentWeek[4][0].timerTaskId, null); // was null
	});
});
