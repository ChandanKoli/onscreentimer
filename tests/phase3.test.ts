import assert from 'node:assert/strict';
import { test } from 'node:test';
import { ClockEngine } from '../src/lib/clock-engine.ts';
import { StopwatchEngine } from '../src/lib/stopwatch-engine.ts';
import {
	renderDigitalSvg,
	calculateClockAngles,
	calculateDurationAngles,
	calculateStopwatchAngles,
	generateHourNumerals,
	generateDialTicks
} from '../src/lib/renderers.ts';
import { parseDuration, formatDuration } from '../src/lib/parser.ts';

test('ClockEngine 12h and 24h formatting logic', () => {
	const clock = new ClockEngine({ initialFormat: '12h' });
	assert.equal(clock.getFormat(), '12h');

	const state12 = clock.getClockState();
	assert.ok(state12.hours >= 1 && state12.hours <= 12);
	assert.ok(state12.minutes >= 0 && state12.minutes <= 59);
	assert.ok(state12.seconds >= 0 && state12.seconds <= 59);
	assert.ok(typeof state12.isAm === 'boolean');
	assert.match(state12.formatted, /^\d{2}:\d{2}:\d{2} (AM|PM)$/);

	clock.setFormat('24h');
	assert.equal(clock.getFormat(), '24h');
	const state24 = clock.getClockState();
	assert.ok(state24.hours >= 0 && state24.hours <= 23);
	assert.match(state24.formatted, /^\d{2}:\d{2}:\d{2}$/);
});

test('StopwatchEngine lifecycle: start, pause, resume, stop, reset', async () => {
	const stopwatch = new StopwatchEngine();
	assert.equal(stopwatch.getStatus(), 'idle');
	assert.equal(stopwatch.getElapsedSeconds(), 0);
	assert.equal(stopwatch.getElapsedMs(), 0);

	// Start
	stopwatch.start();
	assert.equal(stopwatch.getStatus(), 'running');

	// Wait 60ms
	await new Promise((r) => setTimeout(r, 60));
	const elapsed1 = stopwatch.getElapsedMs();
	assert.ok(elapsed1 >= 40, `Elapsed should be >= 40ms, was ${elapsed1}`);

	// Pause
	stopwatch.pause();
	assert.equal(stopwatch.getStatus(), 'paused');
	const pausedElapsed = stopwatch.getElapsedMs();

	// Wait while paused
	await new Promise((r) => setTimeout(r, 50));
	assert.equal(stopwatch.getElapsedMs(), pausedElapsed, 'Elapsed time should not advance while paused');

	// Resume
	stopwatch.resume();
	assert.equal(stopwatch.getStatus(), 'running');
	await new Promise((r) => setTimeout(r, 50));
	assert.ok(stopwatch.getElapsedMs() > pausedElapsed, 'Elapsed time should advance after resume');

	// Stop - MUST PRESERVE FINAL ELAPSED VALUE (not reset to 0!)
	stopwatch.stop();
	assert.equal(stopwatch.getStatus(), 'stopped');
	const finalElapsed = stopwatch.getElapsedMs();
	assert.ok(finalElapsed > 0, 'Final elapsed should be > 0');

	// Wait to verify it remains frozen
	await new Promise((r) => setTimeout(r, 30));
	assert.equal(stopwatch.getElapsedMs(), finalElapsed, 'Stopped stopwatch must preserve elapsed time');

	// Reset - Now returns to 0
	stopwatch.reset();
	assert.equal(stopwatch.getStatus(), 'idle');
	assert.equal(stopwatch.getElapsedMs(), 0);
	assert.equal(stopwatch.getElapsedSeconds(), 0);

	stopwatch.destroy();
});

test('Digital SVG rendering generates valid SVG markup', () => {
	const svg1 = renderDigitalSvg('05:00');
	assert.ok(svg1.includes('<svg viewBox="0 0'), 'Should contain SVG root with viewBox');
	assert.ok(svg1.includes('<polygon points='), 'Should contain segment polygons');
	assert.ok(svg1.includes('</svg>'), 'Should close SVG');

	const svgWithAmPm = renderDigitalSvg('10:30:00', 'AM');
	assert.ok(svgWithAmPm.includes('viewBox='), 'Should render AM indicator');
});

test('Analog angle math calculates finite, valid angles', () => {
	// Clock angles
	const clockMidday = calculateClockAngles(12, 0, 0);
	assert.equal(clockMidday.hourAngle, 0);
	assert.equal(clockMidday.minuteAngle, 0);
	assert.equal(clockMidday.secondAngle, 0);

	const clockThreeOClock = calculateClockAngles(3, 0, 0);
	assert.equal(clockThreeOClock.hourAngle, 90);
	assert.equal(clockThreeOClock.minuteAngle, 0);
	assert.equal(clockThreeOClock.secondAngle, 0);

	const clockSixThirty = calculateClockAngles(6, 30, 0);
	assert.equal(clockSixThirty.hourAngle, 195);
	assert.equal(clockSixThirty.minuteAngle, 180);
	assert.equal(clockSixThirty.secondAngle, 0);

	// Duration angles (Timer and Stopwatch)
	const zeroDuration = calculateDurationAngles(0);
	assert.equal(zeroDuration.hourAngle, 0);
	assert.equal(zeroDuration.minuteAngle, 0);
	assert.equal(zeroDuration.secondAngle, 0);

	const fortyFiveSeconds = calculateDurationAngles(45);
	assert.equal(fortyFiveSeconds.secondAngle, 270);
	assert.equal(fortyFiveSeconds.minuteAngle, 4.5);

	const fiveMinutes = calculateDurationAngles(300);
	assert.equal(fiveMinutes.minuteAngle, 30);
	assert.equal(fiveMinutes.secondAngle, 0);

	// Numerals and ticks
	const numerals = generateHourNumerals();
	assert.equal(numerals.length, 12);
	assert.equal(numerals[11].num, 12);

	const ticks = generateDialTicks();
	assert.equal(ticks.length, 60);
	assert.equal(ticks.filter((t) => t.isHour).length, 12);
});

test('Stopwatch analog hands advance clockwise as elapsed duration increases', () => {
	// Second hand clockwise progression (within 0 to 59s)
	let prevSecAngle = -1;
	for (let sec = 0; sec <= 59; sec += 5) {
		const angles = calculateStopwatchAngles(sec);
		assert.ok(
			angles.secondAngle > prevSecAngle,
			`Second hand at ${sec}s (${angles.secondAngle}deg) must be greater than previous (${prevSecAngle}deg)`
		);
		prevSecAngle = angles.secondAngle;
	}

	// Minute hand clockwise progression (within 0 to 59min)
	let prevMinAngle = -1;
	for (let min = 0; min <= 59; min += 5) {
		const elapsedSeconds = min * 60;
		const angles = calculateStopwatchAngles(elapsedSeconds);
		assert.ok(
			angles.minuteAngle > prevMinAngle,
			`Minute hand at ${min}min (${angles.minuteAngle}deg) must be greater than previous (${prevMinAngle}deg)`
		);
		prevMinAngle = angles.minuteAngle;
	}

	// Hour hand clockwise progression (within 0 to 11hr)
	let prevHrAngle = -1;
	for (let hr = 0; hr <= 11; hr += 1) {
		const elapsedSeconds = hr * 3600;
		const angles = calculateStopwatchAngles(elapsedSeconds);
		assert.ok(
			angles.hourAngle > prevHrAngle,
			`Hour hand at ${hr}hr (${angles.hourAngle}deg) must be greater than previous (${prevHrAngle}deg)`
		);
		prevHrAngle = angles.hourAngle;
	}

	// Verify exact standard 90-degree quadrant positions:
	// 0s -> 0deg (12 o'clock, top)
	assert.equal(calculateStopwatchAngles(0).secondAngle, 0);
	// 15s -> 90deg (3 o'clock, right)
	assert.equal(calculateStopwatchAngles(15).secondAngle, 90);
	// 30s -> 180deg (6 o'clock, bottom)
	assert.equal(calculateStopwatchAngles(30).secondAngle, 180);
	// 45s -> 270deg (9 o'clock, left)
	assert.equal(calculateStopwatchAngles(45).secondAngle, 270);
});

test('Phase 2 Timer parsing and duration formatting regressions', () => {
	assert.equal(formatDuration(0), '00:00');
	assert.equal(formatDuration(65), '01:05');
	assert.equal(formatDuration(3600), '01:00:00');

	const p1 = parseDuration('5');
	assert.ok(p1.ok && p1.seconds === 300);

	const p2 = parseDuration('2mins');
	assert.ok(p2.ok && p2.seconds === 120);

	const p3 = parseDuration('02:00');
	assert.ok(p3.ok && p3.seconds === 120);

	const p4 = parseDuration('1hr 30mins');
	assert.ok(p4.ok && p4.seconds === 5400);
});

test('TimerEngine lifecycle: start, pause, resume, reset, stop', async () => {
	const { TimerEngine } = await import('../src/lib/timer-engine.ts');
	const timer = new TimerEngine({ initialDurationSeconds: 10 });
	assert.equal(timer.getStatus(), 'idle');
	assert.equal(timer.getRemainingSeconds(), 10);

	timer.start();
	assert.equal(timer.getStatus(), 'running');

	await new Promise((r) => setTimeout(r, 60));
	timer.pause();
	assert.equal(timer.getStatus(), 'paused');
	const remainingAfterPause = timer.getRemainingMs();
	assert.ok(remainingAfterPause < 10000, 'Remaining ms should have decreased');

	// Wait while paused to ensure no drift
	await new Promise((r) => setTimeout(r, 50));
	assert.equal(timer.getRemainingMs(), remainingAfterPause, 'Paused timer must not advance');

	timer.resume();
	assert.equal(timer.getStatus(), 'running');

	// Stop - MUST zero the remaining duration per Timer spec
	timer.stop();
	assert.equal(timer.getStatus(), 'completed');
	assert.equal(timer.getRemainingSeconds(), 0);
	assert.equal(timer.getRemainingMs(), 0);

	// Reset - returns to initial duration (now 0 per new stop semantics)
	timer.reset();
	assert.equal(timer.getStatus(), 'idle');
	assert.equal(timer.getRemainingSeconds(), 0);

	timer.destroy();
});

test('Session continuity: Timer and Stopwatch continue accurately across mode changes', async () => {
	const { TimerEngine } = await import('../src/lib/timer-engine.ts');
	const timer = new TimerEngine({ initialDurationSeconds: 60 });
	const stopwatch = new StopwatchEngine();

	// 1. User is on Timer and starts a 60s timer
	timer.start();
	assert.equal(timer.getStatus(), 'running');

	// 2. User switches visible MODE to 'stopwatch' and starts stopwatch
	stopwatch.start();
	assert.equal(stopwatch.getStatus(), 'running');

	// Let time elapse while both run concurrently in memory
	await new Promise((r) => setTimeout(r, 80));

	// Verify both sessions kept running accurately without interfering
	assert.equal(timer.getStatus(), 'running');
	assert.equal(stopwatch.getStatus(), 'running');

	assert.ok(timer.getRemainingMs() < 60000, 'Timer must continue running while user views Stopwatch');
	assert.ok(stopwatch.getElapsedMs() >= 60, 'Stopwatch must advance accurately');

	// 3. User switches to 'clock' (passive)
	const clock = new ClockEngine({ initialFormat: '12h' });
	clock.start();
	assert.equal(clock.getClockState().format, '12h');

	await new Promise((r) => setTimeout(r, 40));

	// Both background engines still intact
	assert.ok(timer.getRemainingMs() < 59900);
	assert.ok(stopwatch.getElapsedMs() >= 100);

	// 4. Return to Stopwatch and stop (preserves elapsed)
	stopwatch.stop();
	assert.equal(stopwatch.getStatus(), 'stopped');
	const savedElapsed = stopwatch.getElapsedMs();
	assert.ok(savedElapsed > 0);

	// Timer still running!
	assert.equal(timer.getStatus(), 'running');

	timer.destroy();
	stopwatch.destroy();
	clock.destroy();
});
