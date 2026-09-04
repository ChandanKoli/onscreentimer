import test from 'node:test';
import assert from 'node:assert';
import { serializeState, hydrateState, SCHEMA_VERSION } from '../src/lib/persistence.ts';
import type { AppState } from '../src/lib/types.ts';

test('Valid current schema serializes and hydrates', () => {
	const now = 10000;
	const state: AppState = {
		mode: 'timer' as const,
		style: 'modern' as const,
		size: 'mid' as const,
		previousNonFullSize: 'mid' as const,
		soundEnabled: true,
		timer: {
			status: 'idle' as const,
			initialDurationSeconds: 300,
			remainingMs: 300000,
			targetEndTime: null
		},
		stopwatch: {
			status: 'idle' as const,
			accumulatedMs: 0,
			startTime: null
		},
		tasks: [
			{ id: '1', text: 'Task 1', status: 'pending' as const, elapsedMs: 0, startTime: null }
		],
		activeSessionEngine: null,
		todoMinimized: false,
		clockFormat: '24h', activePresetId: null, activeSegmentIndex: 0
	};

	const serialized = serializeState(state);
	const hydrated = hydrateState(serialized, now);

	assert.deepStrictEqual(hydrated, state);
});

test('Corrupt JSON falls back safely', () => {
	const hydrated = hydrateState('{ malformed json }', 10000);
	assert.strictEqual(hydrated, null);
});

test('Unsupported version falls back safely', () => {
	const state = { version: 999, mode: 'timer' };
	const hydrated = hydrateState(JSON.stringify(state), 10000);
	assert.strictEqual(hydrated, null);
});

test('Invalid MODE/STYLE/SIZE values are rejected/sanitized', () => {
	const now = 10000;
	const state = {
		version: SCHEMA_VERSION,
		mode: 'invalid',
		style: 'invalid',
		size: 'invalid',
		previousNonFullSize: 'invalid',
		soundEnabled: true,
		timer: { status: 'idle', initialDurationSeconds: 0, remainingMs: 0, targetEndTime: null },
		stopwatch: { status: 'idle', accumulatedMs: 0, startTime: null },
		tasks: [],
		activeSessionEngine: null
	};
	const hydrated = hydrateState(JSON.stringify(state), now);
	assert.ok(hydrated);
	assert.strictEqual(hydrated.mode, 'timer');
	assert.strictEqual(hydrated.style, 'modern');
	assert.strictEqual(hydrated.size, 'mid');
	assert.strictEqual(hydrated.previousNonFullSize, 'mid');
});

test('Tasks survive serialization with identity/text/status/order/duration', () => {
	const now = 10000;
	const state = {
		mode: 'timer' as const,
		style: 'modern' as const,
		size: 'mid' as const,
		previousNonFullSize: 'mid' as const,
		soundEnabled: true,
		timer: { status: 'idle' as const, initialDurationSeconds: 0, remainingMs: 0, targetEndTime: null },
		stopwatch: { status: 'idle' as const, accumulatedMs: 0, startTime: null },
		tasks: [
			{ id: '1', text: 'T1', status: 'completed' as const, elapsedMs: 5000, startTime: null },
			{ id: '2', text: 'T2', status: 'pending' as const, elapsedMs: 0, startTime: null }
		],
		activeSessionEngine: null
	};
	
	const serialized = serializeState(state);
	const hydrated = hydrateState(serialized, now);
	assert.ok(hydrated);
	assert.deepStrictEqual(hydrated.tasks, state.tasks);
});

test('Paused Timer does not lose time while unavailable', () => {
	const state = {
		version: SCHEMA_VERSION,
		mode: 'timer',
		style: 'modern',
		size: 'mid',
		soundEnabled: true,
		timer: { status: 'paused', initialDurationSeconds: 300, remainingMs: 200000, targetEndTime: null },
		stopwatch: { status: 'idle', accumulatedMs: 0, startTime: null },
		tasks: [],
		activeSessionEngine: null
	};
	const hydrated = hydrateState(JSON.stringify(state), 20000);
	assert.ok(hydrated);
	assert.strictEqual(hydrated.timer.status, 'paused');
	assert.strictEqual(hydrated.timer.remainingMs, 200000);
});

test('Running Timer deducts real elapsed wall time', () => {
	const state = {
		version: SCHEMA_VERSION,
		mode: 'timer',
		style: 'modern',
		size: 'mid',
		soundEnabled: true,
		timer: { status: 'running', initialDurationSeconds: 300, remainingMs: 300000, targetEndTime: 300000 },
		stopwatch: { status: 'idle', accumulatedMs: 0, startTime: null },
		tasks: [],
		activeSessionEngine: null
	};
	// 5 seconds later
	const hydrated = hydrateState(JSON.stringify(state), 5000);
	assert.ok(hydrated);
	assert.strictEqual(hydrated.timer.status, 'running');
	assert.strictEqual(hydrated.timer.targetEndTime, 300000);
});

test('Running Timer that expired while unavailable restores at 00:00 and releases task ownership', () => {
	const state = {
		version: SCHEMA_VERSION,
		mode: 'timer',
		style: 'modern',
		size: 'mid',
		soundEnabled: true,
		timer: { status: 'running', initialDurationSeconds: 300, remainingMs: 10000, targetEndTime: 10000 },
		stopwatch: { status: 'idle', accumulatedMs: 0, startTime: null },
		tasks: [],
		activeSessionEngine: 'timer'
	};
	// Hydrate at 15000, past the targetEndTime
	const hydrated = hydrateState(JSON.stringify(state), 15000);
	assert.ok(hydrated);
	assert.strictEqual(hydrated.timer.status, 'completed');
	assert.strictEqual(hydrated.timer.remainingMs, 0);
	assert.strictEqual(hydrated.activeSessionEngine, null);
});

test('Current task timing under running Timer is capped at Timer expiration', () => {
	const state = {
		version: SCHEMA_VERSION,
		mode: 'timer',
		style: 'modern',
		size: 'mid',
		soundEnabled: true,
		timer: { status: 'running', initialDurationSeconds: 300, remainingMs: 10000, targetEndTime: 10000 },
		stopwatch: { status: 'idle', accumulatedMs: 0, startTime: null },
		tasks: [
			{ id: '1', text: 'T1', status: 'current', elapsedMs: 5000, startTime: 0 }
		],
		activeSessionEngine: 'timer'
	};
	// Hydrate at 15000. Task started at 0. Timer expires at 10000. Task should gain 10000ms.
	const hydrated = hydrateState(JSON.stringify(state), 15000);
	assert.ok(hydrated);
	assert.strictEqual(hydrated.tasks[0].elapsedMs, 15000);
	assert.strictEqual(hydrated.tasks[0].startTime, null); // since timer stopped
});

test('Running Stopwatch gains elapsed wall time while unavailable', () => {
	const state = {
		version: SCHEMA_VERSION,
		mode: 'stopwatch',
		style: 'modern',
		size: 'mid',
		soundEnabled: true,
		timer: { status: 'idle', initialDurationSeconds: 0, remainingMs: 0, targetEndTime: null },
		stopwatch: { status: 'running', accumulatedMs: 5000, startTime: 10000 },
		tasks: [],
		activeSessionEngine: null
	};
	// Hydrate at 15000. Engine doesn't compute total elapsedMs in hydration, it keeps startTime and accumulatedMs
	const hydrated = hydrateState(JSON.stringify(state), 15000);
	assert.ok(hydrated);
	assert.strictEqual(hydrated.stopwatch.status, 'running');
	assert.strictEqual(hydrated.stopwatch.accumulatedMs, 5000);
	assert.strictEqual(hydrated.stopwatch.startTime, 10000);
});

test('Current tasks under Stopwatch owner gain the correct unavailable duration', () => {
	const state = {
		version: SCHEMA_VERSION,
		mode: 'stopwatch',
		style: 'modern',
		size: 'mid',
		soundEnabled: true,
		timer: { status: 'idle', initialDurationSeconds: 0, remainingMs: 0, targetEndTime: null },
		stopwatch: { status: 'running', accumulatedMs: 5000, startTime: 10000 },
		tasks: [
			{ id: '1', text: 'T1', status: 'current', elapsedMs: 2000, startTime: 10000 }
		],
		activeSessionEngine: 'stopwatch'
	};
	// Hydrate at 15000. Task should add (15000 - 10000) = 5000ms.
	const hydrated = hydrateState(JSON.stringify(state), 15000);
	assert.ok(hydrated);
	assert.strictEqual(hydrated.tasks[0].elapsedMs, 7000);
	assert.strictEqual(hydrated.tasks[0].startTime, 15000); // Updated to now
});

test('Missing sound preference defaults to OFF', () => {
	const state = { version: SCHEMA_VERSION, mode: 'timer' }; // soundEnabled omitted
	const hydrated = hydrateState(JSON.stringify(state), 10000);
	assert.ok(hydrated);
	assert.strictEqual(hydrated.soundEnabled, false);
});

test('Persisted sound ON restores ON', () => {
	const state = { version: SCHEMA_VERSION, mode: 'timer', soundEnabled: true };
	const hydrated = hydrateState(JSON.stringify(state), 10000);
	assert.ok(hydrated);
	assert.strictEqual(hydrated.soundEnabled, true);
});

test('Persisted sound OFF restores OFF', () => {
	const state = { version: SCHEMA_VERSION, mode: 'timer', soundEnabled: false };
	const hydrated = hydrateState(JSON.stringify(state), 10000);
	assert.ok(hydrated);
	assert.strictEqual(hydrated.soundEnabled, false);
});
