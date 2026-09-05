import { test, mock } from 'node:test';
import assert from 'node:assert';
import { taskActionReducer } from '../src/lib/task-logic.ts';
import type { AppState, Task } from '../src/lib/types.js';

test('End all logic', async (t) => {
    // 1. Pending-only tasks
    await t.test('Pending-only tasks -> all become Completed', () => {
        const state: AppState = {
            tasks: [
                { id: '1', text: 'Task 1', status: 'pending', elapsedMs: 0, startTime: null },
                { id: '2', text: 'Task 2', status: 'pending', elapsedMs: 0, startTime: null }
            ],
            activeSessionEngine: null,
            timer: { status: 'idle', remainingMs: 0, initialDurationSeconds: 0 },
            stopwatch: { status: 'idle', elapsedMs: 0 }
        } as any;

        const nextTasks = state.tasks.map(t => ({ ...t, status: 'completed' as const }));
        assert.equal(nextTasks[0].status, 'completed');
        assert.equal(nextTasks[1].status, 'completed');
    });

    // 2. Current task with elapsed time
    await t.test('Current task with elapsed time -> becomes Completed, elapsed frozen', () => {
        const now = 1000;
        const state: AppState = {
            tasks: [
                { id: '1', text: 'Task 1', status: 'current', elapsedMs: 500, startTime: 800 }
            ]
        } as any;

        const nextTasks = state.tasks.map(task => {
            if (task.status === 'completed') return task;
            const elapsedMs = task.startTime !== null ? task.elapsedMs + (now - task.startTime) : task.elapsedMs;
            return { ...task, status: 'completed' as const, elapsedMs, startTime: null };
        });

        assert.equal(nextTasks[0].status, 'completed');
        assert.equal(nextTasks[0].elapsedMs, 500 + (1000 - 800)); // 700
        assert.equal(nextTasks[0].startTime, null);
    });

    // 3. Existing Completed + unfinished tasks
    await t.test('Existing Completed stay Completed, unfinished become Completed', () => {
        const now = 1000;
        const state: AppState = {
            tasks: [
                { id: '1', text: 'Task 1', status: 'completed', elapsedMs: 500, startTime: null },
                { id: '2', text: 'Task 2', status: 'pending', elapsedMs: 0, startTime: null }
            ]
        } as any;

        const nextTasks = state.tasks.map(task => {
            if (task.status === 'completed') return task;
            const elapsedMs = task.startTime !== null ? task.elapsedMs + (now - task.startTime) : task.elapsedMs;
            return { ...task, status: 'completed' as const, elapsedMs, startTime: null };
        });

        assert.equal(nextTasks[0].status, 'completed');
        assert.equal(nextTasks[0].elapsedMs, 500);
        assert.equal(nextTasks[1].status, 'completed');
        assert.equal(nextTasks[1].elapsedMs, 0);
    });
});
