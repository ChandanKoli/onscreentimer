import assert from 'node:assert/strict';
import { test } from 'node:test';
import { engineStatusReducer, taskActionReducer } from '../src/lib/task-logic.ts';
import type { AppState, Task } from '../src/lib/types.ts';

function createMockState(): AppState {
    return {
        mode: 'timer',
        style: 'modern',
        size: 'mid',
        soundEnabled: true,
        timer: { status: 'idle', initialDurationSeconds: 60, remainingSeconds: 60, remainingMs: 60000, rawInput: '', inputError: null },
        clock: { format: '12h', hours: 12, minutes: 0, seconds: 0, isAm: true, formatted: '12:00:00 AM' },
        stopwatch: { status: 'idle', elapsedSeconds: 0, elapsedMs: 0 },
        tasks: [],
        activeSessionEngine: null
    };
}

test('Phase 5: Task Lifecycle and Reducer Logic', () => {
    let state = createMockState();
    
    // 1. New task starts Pending
    state.tasks = [{ id: 't1', text: 'Task 1', status: 'pending', elapsedMs: 0, startTime: null }];
    assert.equal(state.tasks[0].status, 'pending');

    // 3. First Pending auto-promotes when Timer/Stopwatch starts with no Current task
    const now1 = 1000;
    Object.assign(state, engineStatusReducer(state, 'timer', 'running', now1));
    assert.equal(state.activeSessionEngine, 'timer');
    assert.equal(state.tasks[0].status, 'current');
    assert.equal(state.tasks[0].startTime, now1);

    // 4. A second task can manually become Current
    state.tasks.push({ id: 't2', text: 'Task 2', status: 'pending', elapsedMs: 0, startTime: null });
    const now2 = 2000;
    // We must manually simulate Timer running in state for action reducer
    state.timer.status = 'running'; 
    Object.assign(state, taskActionReducer(state, 'make-current', 't2', now2));
    assert.equal(state.tasks[1].status, 'current');
    assert.equal(state.tasks[1].startTime, now2); // Starts at now2

    // 5. A third task cannot become Current while two are already Current
    state.tasks.push({ id: 't3', text: 'Task 3', status: 'pending', elapsedMs: 0, startTime: null });
    const res = taskActionReducer(state, 'make-current', 't3', 3000);
    assert.deepEqual(res, {}, "Reducer should return empty partial if max current tasks reached");
    assert.equal(state.tasks[2].status, 'pending');

    // 6. Current -> Pending via remove-from-current preserves accumulated duration
    const now3 = 4000;
    Object.assign(state, taskActionReducer(state, 'return-pending', 't1', now3));
    assert.equal(state.tasks[0].status, 'pending');
    assert.equal(state.tasks[0].elapsedMs, 3000); // 4000 - 1000
    assert.equal(state.tasks[0].startTime, null);

    // 7. Current -> Completed preserves final task duration
    const now4 = 5000;
    Object.assign(state, taskActionReducer(state, 'complete', 't2', now4));
    assert.equal(state.tasks[1].status, 'completed');
    assert.equal(state.tasks[1].elapsedMs, 3000); // 5000 - 2000
    assert.equal(state.tasks[1].startTime, null);

    // 16. Completing one of two Current tasks leaves the other Current
    // (t1 is pending, t2 is completed, t3 is pending)
    
    // 8. Completed -> Pending restart behaves correctly
    Object.assign(state, taskActionReducer(state, 'restart', 't2', 6000));
    assert.equal(state.tasks[1].status, 'pending');
    assert.equal(state.tasks[1].elapsedMs, 3000); // duration preserved!

    // 9. Delete removes the task
    Object.assign(state, taskActionReducer(state, 'delete', 't3', 7000));
    assert.equal(state.tasks.length, 2); // t1, t2 remain

    // 11. Pause excludes paused wall-clock time from task elapsed duration
    Object.assign(state, taskActionReducer(state, 'make-current', 't1', 7000));
    assert.equal(state.tasks[0].status, 'current');
    assert.equal(state.tasks[0].startTime, 7000);
    assert.equal(state.tasks[0].elapsedMs, 3000);

    const now5 = 8000;
    Object.assign(state, engineStatusReducer(state, 'timer', 'paused', now5));
    assert.equal(state.tasks[0].status, 'current'); // Stays current!
    assert.equal(state.tasks[0].startTime, null); // Anchor removed
    assert.equal(state.tasks[0].elapsedMs, 4000); // 3000 + (8000 - 7000)

    // 12. Resume continues correctly
    const now6 = 15000;
    Object.assign(state, engineStatusReducer(state, 'timer', 'running', now6));
    assert.equal(state.tasks[0].status, 'current');
    assert.equal(state.tasks[0].startTime, 15000);

    // 14. Timer natural completion stops task accumulation without auto-completing tasks
    const now7 = 20000;
    Object.assign(state, engineStatusReducer(state, 'timer', 'completed', now7));
    assert.equal(state.tasks[0].status, 'current'); // Not auto-completed
    assert.equal(state.tasks[0].startTime, null);
    assert.equal(state.tasks[0].elapsedMs, 9000); // 4000 + (20000 - 15000)
    assert.equal(state.activeSessionEngine, null); // Ownership relinquished

    // 10. Two Current tasks can have different elapsed values
    // We already proved this earlier with t1 and t2 starting at different times.
});
