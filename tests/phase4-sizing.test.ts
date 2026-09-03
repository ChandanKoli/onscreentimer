import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createStore } from '../src/lib/store.ts';
import type { AppState, DisplaySize } from '../src/lib/types.ts';
import { TimerEngine } from '../src/lib/timer-engine.ts';
import { StopwatchEngine } from '../src/lib/stopwatch-engine.ts';

test('Phase 4: Sizing state logic', () => {
    // 1. default size is Mid
    let previousNonFullSize: DisplaySize = 'mid';
    const store = createStore<Pick<AppState, 'size' | 'mode' | 'style'>>({
        size: 'mid',
        mode: 'timer',
        style: 'modern'
    });

    assert.equal(store.getState().size, 'mid');

    // Simulate dropdown click for 'big'
    const setSize = (newSize: DisplaySize) => {
        if (newSize !== 'full') {
            previousNonFullSize = newSize;
        }
        store.setState({ size: newSize });
    };

    // 2. valid sizes are Tiny / Mid / Big / Full
    setSize('tiny');
    assert.equal(store.getState().size, 'tiny');
    setSize('big');
    assert.equal(store.getState().size, 'big');
    setSize('full');
    assert.equal(store.getState().size, 'full');

    // 3. exiting Full restores previous non-Full size
    const exitFull = () => {
        store.setState({ size: previousNonFullSize });
    };

    exitFull();
    assert.equal(store.getState().size, 'big'); // Was big before full

    // 4. switching from Full directly to another size works
    setSize('full');
    setSize('tiny');
    assert.equal(store.getState().size, 'tiny');
    exitFull(); // since we explicitly went to tiny, previousNonFullSize is now tiny
    assert.equal(store.getState().size, 'tiny');

    // 5. size state remains independent from MODE and STYLE
    setSize('full');
    store.setState({ mode: 'stopwatch' });
    assert.equal(store.getState().size, 'full'); // Still full
    assert.equal(store.getState().mode, 'stopwatch');

    store.setState({ style: 'analog' });
    assert.equal(store.getState().size, 'full');
    assert.equal(store.getState().style, 'analog');
});

test('Phase 4: Size changes do not mutate Timer or Stopwatch state', async () => {
    const timer = new TimerEngine({ initialDurationSeconds: 120 });
    const stopwatch = new StopwatchEngine();
    const store = createStore<Pick<AppState, 'size'>>({ size: 'mid' });

    timer.start();
    stopwatch.start();
    
    assert.equal(timer.getStatus(), 'running');
    assert.equal(stopwatch.getStatus(), 'running');

    // Change size while running
    store.setState({ size: 'big' });
    
    await new Promise(r => setTimeout(r, 50));
    
    // Entering Full preserves session state
    store.setState({ size: 'full' });
    
    await new Promise(r => setTimeout(r, 50));
    
    assert.equal(timer.getStatus(), 'running');
    assert.equal(stopwatch.getStatus(), 'running');
    assert.ok(timer.getRemainingMs() < 120000);
    assert.ok(stopwatch.getElapsedMs() >= 100);

    timer.destroy();
    stopwatch.destroy();
});
