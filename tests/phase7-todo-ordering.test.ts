import { test } from 'node:test';
import assert from 'node:assert';
import { taskActionReducer } from '../src/lib/task-logic.ts';
import type { Task, AppState } from '../src/lib/types.ts';
import { hydrateState, serializeState } from '../src/lib/persistence.ts';
import { ClockEngine } from '../src/lib/clock-engine.ts';

test('Phase 7: Task Order and Counts logic', () => {
	const initialTasks: Task[] = [
		{ id: '1', text: 'Task 1', status: 'pending', elapsedMs: 0, startTime: null },
		{ id: '2', text: 'Task 2', status: 'pending', elapsedMs: 0, startTime: null },
		{ id: '3', text: 'Task 3', status: 'pending', elapsedMs: 0, startTime: null },
	];

	let state: AppState = {
		mode: 'timer',
		style: 'modern',
		size: 'mid',
		soundEnabled: false,
		timer: { status: 'idle', initialDurationSeconds: 0, remainingSeconds: 0, remainingMs: 0, rawInput: '', inputError: null },
		clock: { format: '24h', hours: 0, minutes: 0, seconds: 0, isAm: true, formatted: '' },
		stopwatch: { status: 'idle', elapsedSeconds: 0, elapsedMs: 0 },
		tasks: initialTasks,
		activeSessionEngine: null,
		todoMinimized: false,
		clockFormat: '24h'
	};

	// 1. Complete Task 2
	let nextState = taskActionReducer(state, 'complete', '2', 0);
	state = { ...state, ...nextState };
	
	// Separate for render logic
	let unfinished = state.tasks.filter(t => t.status !== 'completed');
	let completed = state.tasks.filter(t => t.status === 'completed');
	let displayTasks = [...unfinished, ...completed];

	assert.strictEqual(displayTasks.length, 3);
	assert.strictEqual(displayTasks[0].id, '1', 'Unfinished 1 first');
	assert.strictEqual(displayTasks[1].id, '3', 'Unfinished 3 second');
	assert.strictEqual(displayTasks[2].id, '2', 'Completed 2 last');
	
	let countDone = completed.length;
	let countRemaining = unfinished.length;
	assert.strictEqual(countDone, 1, '1 done');
	assert.strictEqual(countRemaining, 2, '2 remaining');

	// Complete Task 1
	nextState = taskActionReducer(state, 'complete', '1', 0);
	state = { ...state, ...nextState };
	
	unfinished = state.tasks.filter(t => t.status !== 'completed');
	completed = state.tasks.filter(t => t.status === 'completed');
	displayTasks = [...unfinished, ...completed];
	
	assert.strictEqual(displayTasks[0].id, '3', 'Unfinished 3 first');
	// Creation order within completed
	assert.strictEqual(displayTasks[1].id, '1', 'Completed 1 is before 2');
	assert.strictEqual(displayTasks[2].id, '2', 'Completed 2 is after 1');
	
	// Restart Task 2
	nextState = taskActionReducer(state, 'restart', '2', 0);
	state = { ...state, ...nextState };
	
	unfinished = state.tasks.filter(t => t.status !== 'completed');
	completed = state.tasks.filter(t => t.status === 'completed');
	displayTasks = [...unfinished, ...completed];

	// Unfinished: Task 2 and Task 3 (in creation order: 2 then 3)
	assert.strictEqual(displayTasks[0].id, '2', 'Unfinished 2 first');
	assert.strictEqual(displayTasks[1].id, '3', 'Unfinished 3 second');
	assert.strictEqual(displayTasks[2].id, '1', 'Completed 1 last');

	// Make Task 3 Current
	nextState = taskActionReducer(state, 'make-current', '3', 0);
	state = { ...state, ...nextState };
	unfinished = state.tasks.filter(t => t.status !== 'completed');
	assert.strictEqual(unfinished.length, 2, 'Pending and Current both count as remaining');
	
	// Delete Task 1
	nextState = taskActionReducer(state, 'delete', '1', 0);
	state = { ...state, ...nextState };
	completed = state.tasks.filter(t => t.status === 'completed');
	assert.strictEqual(completed.length, 0, 'Deletion updates counts');
});

test('Phase 7: Persistence does not corrupt statuses or order', () => {
	const initialTasks: Task[] = [
		{ id: '1', text: 'Task 1', status: 'pending', elapsedMs: 0, startTime: null },
		{ id: '2', text: 'Task 2', status: 'completed', elapsedMs: 0, startTime: null },
		{ id: '3', text: 'Task 3', status: 'current', elapsedMs: 0, startTime: 0 },
	];
	const serialized = serializeState({
		mode: 'timer',
		style: 'modern',
		size: 'mid',
		previousNonFullSize: 'mid',
		soundEnabled: true,
		timer: { status: 'idle', initialDurationSeconds: 0, remainingMs: 0, targetEndTime: null },
		stopwatch: { status: 'idle', accumulatedMs: 0, startTime: null },
		tasks: initialTasks,
		activeSessionEngine: 'timer',
		todoMinimized: true,
		clockFormat: '12h'
	});
	
	const hydrated = hydrateState(serialized, 0);
	assert.ok(hydrated);
	assert.strictEqual(hydrated.tasks.length, 3);
	assert.strictEqual(hydrated.tasks[0].id, '1');
	assert.strictEqual(hydrated.tasks[1].status, 'completed');
	assert.strictEqual(hydrated.todoMinimized, true);
	assert.strictEqual(hydrated.clockFormat, '12h');
});

test('Phase 7: 12h/24h Clock Format logic', () => {
	const engine = new ClockEngine({ initialFormat: '12h' });
	assert.strictEqual(engine.getFormat(), '12h');
	engine.setFormat('24h');
	assert.strictEqual(engine.getFormat(), '24h');
});
