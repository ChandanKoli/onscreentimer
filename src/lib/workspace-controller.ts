import { createStore } from './store';
import { TimerEngine } from './timer-engine';
import { StopwatchEngine } from './stopwatch-engine';
import { ClockEngine } from './clock-engine';
import { parseDuration, formatDuration } from './parser';
import {
	renderDigitalSvg,
	calculateClockAngles,
	calculateDurationAngles,
	calculateStopwatchAngles
} from './renderers';
import type { AppState, AppMode, DisplayStyle, TimerStatus, StopwatchStatus } from './types';

export function initWorkspaceController() {
	// Root DOM Elements
	const originalTitle = document.title;

	// Display Elements
	const displayModern = document.getElementById('display-modern');
	const modernTimeText = document.getElementById('modern-time-text');
	const modernTimePeriod = document.getElementById('modern-time-period');

	const displayDigital = document.getElementById('display-digital');
	const digitalSvgContainer = document.getElementById('digital-svg-container');

	const displayAnalog = document.getElementById('display-analog');
	const handHour = document.getElementById('hand-hour') as SVGLineElement | null;
	const handMinute = document.getElementById('hand-minute') as SVGLineElement | null;
	const handSecondGroup = document.getElementById('hand-second-group') as SVGGElement | null;
	const analogNumericalReadout = document.getElementById('analog-numerical-readout');

	// Controls Rows
	const controlsTimer = document.getElementById('controls-timer');
	const controlsStopwatch = document.getElementById('controls-stopwatch');
	const controlsClock = document.getElementById('controls-clock');

	// Timer Controls
	const timerInput = document.getElementById('timer-input') as HTMLInputElement | null;
	const timerError = document.getElementById('timer-input-error');
	const timerForm = document.getElementById('timer-form') as HTMLFormElement | null;
	const btnTimerPrimary = document.getElementById('btn-timer-primary') as HTMLButtonElement | null;
	const btnTimerReset = document.getElementById('btn-timer-reset') as HTMLButtonElement | null;
	const btnTimerStop = document.getElementById('btn-timer-stop') as HTMLButtonElement | null;

	// Stopwatch Controls
	const btnStopwatchPrimary = document.getElementById('btn-stopwatch-primary') as HTMLButtonElement | null;
	const btnStopwatchReset = document.getElementById('btn-stopwatch-reset') as HTMLButtonElement | null;
	const btnStopwatchStop = document.getElementById('btn-stopwatch-stop') as HTMLButtonElement | null;

	// Dropdown Controls
	const btnModeDropdown = document.getElementById('btn-mode-dropdown') as HTMLButtonElement | null;
	const modeDropdownMenu = document.getElementById('mode-dropdown-menu');
	const modeDropdownContainer = document.getElementById('mode-dropdown-container');

	const btnStyleDropdown = document.getElementById('btn-style-dropdown') as HTMLButtonElement | null;
	const styleDropdownMenu = document.getElementById('style-dropdown-menu');
	const styleDropdownContainer = document.getElementById('style-dropdown-container');

	if (!displayModern || !btnTimerPrimary || !btnTimerReset || !btnTimerStop || !timerInput) {
		// Elements not yet in DOM
		return;
	}

	// 1. Unified State Store
	const store = createStore<AppState>({
		mode: 'timer',
		style: 'modern',
		size: 'mid',
		soundEnabled: true,
		timer: {
			status: 'idle',
			initialDurationSeconds: 0,
			remainingSeconds: 0,
			remainingMs: 0,
			rawInput: '',
			inputError: null
		},
		clock: {
			format: '12h',
			hours: 12,
			minutes: 0,
			seconds: 0,
			isAm: true,
			formatted: '12:00:00 AM'
		},
		stopwatch: {
			status: 'idle',
			elapsedSeconds: 0,
			elapsedMs: 0
		}
	});

	// 2. Engines Initialization
	const timerEngine = new TimerEngine({
		initialDurationSeconds: 0,
		onTick: (remainingSeconds, remainingMs) => {
			store.setState((prev) => ({
				...prev,
				timer: {
					...prev.timer,
					remainingSeconds,
					remainingMs
				}
			}));
		},
		onStatusChange: (status: TimerStatus) => {
			store.setState((prev) => ({
				...prev,
				timer: {
					...prev.timer,
					status
				}
			}));
		},
		onComplete: () => {
			// Subtle visual completion feedback on modern/digital display
			modernTimeText?.classList.add('text-blue-600', 'dark:text-blue-400');
			setTimeout(() => {
				modernTimeText?.classList.remove('text-blue-600', 'dark:text-blue-400');
			}, 1500);
		}
	});

	const stopwatchEngine = new StopwatchEngine({
		onTick: (elapsedSeconds, elapsedMs) => {
			store.setState((prev) => ({
				...prev,
				stopwatch: {
					...prev.stopwatch,
					elapsedSeconds,
					elapsedMs
				}
			}));
		},
		onStatusChange: (status: StopwatchStatus) => {
			store.setState((prev) => ({
				...prev,
				stopwatch: {
					...prev.stopwatch,
					status
				}
			}));
		}
	});

	const clockEngine = new ClockEngine({
		initialFormat: '12h',
		onTick: (clockState) => {
			store.setState((prev) => ({
				...prev,
				clock: clockState
			}));
		}
	});

	// Start Clock immediately so real time is always accurate with zero drift
	clockEngine.start();

	// 3. Helper: Timer validation errors
	function setTimerInputError(msg: string | null) {
		store.setState((prev) => ({
			...prev,
			timer: {
				...prev.timer,
				inputError: msg
			}
		}));

		if (timerError) {
			if (msg) {
				timerError.textContent = msg;
				timerError.classList.remove('hidden');
				timerInput?.setAttribute('aria-invalid', 'true');
			} else {
				timerError.textContent = '';
				timerError.classList.add('hidden');
				timerInput?.removeAttribute('aria-invalid');
			}
		}
	}

	// Helper: Set SVG hand rotation ensuring both SVG transform attribute and CSS transform align
	function setHandRotation(el: SVGElement | null, angle: number) {
		if (!el) return;
		el.setAttribute('transform', `rotate(${angle} 150 150)`);
		el.style.transform = `rotate(${angle}deg)`;
	}

	// 4. Subscriber: DOM Updates
	store.subscribe((state) => {
		const { mode, style, timer, clock, stopwatch } = state;

		// --- A. Controls Row Visibility ---
		if (controlsTimer) {
			if (mode === 'timer') {
				controlsTimer.classList.remove('hidden');
				controlsTimer.classList.add('flex');
			} else {
				controlsTimer.classList.add('hidden');
				controlsTimer.classList.remove('flex');
			}
		}

		if (controlsStopwatch) {
			if (mode === 'stopwatch') {
				controlsStopwatch.classList.remove('hidden');
				controlsStopwatch.classList.add('flex');
			} else {
				controlsStopwatch.classList.add('hidden');
				controlsStopwatch.classList.remove('flex');
			}
		}

		if (controlsClock) {
			if (mode === 'clock') {
				controlsClock.classList.remove('hidden');
			} else {
				controlsClock.classList.add('hidden');
			}
		}

		// --- B. Display Style Visibility ---
		if (displayModern) {
			if (style === 'modern') {
				displayModern.classList.remove('hidden');
				displayModern.classList.add('flex');
			} else {
				displayModern.classList.add('hidden');
				displayModern.classList.remove('flex');
			}
		}

		if (displayDigital) {
			if (style === 'digital') {
				displayDigital.classList.remove('hidden');
				displayDigital.classList.add('flex');
			} else {
				displayDigital.classList.add('hidden');
				displayDigital.classList.remove('flex');
			}
		}

		if (displayAnalog) {
			if (style === 'analog') {
				displayAnalog.classList.remove('hidden');
				displayAnalog.classList.add('flex');
			} else {
				displayAnalog.classList.add('hidden');
				displayAnalog.classList.remove('flex');
			}
		}

		// --- C. Render Time by Mode ---
		if (mode === 'timer') {
			const formatted = formatDuration(timer.remainingSeconds);

			// Browser Tab Title (Timer)
			if (timer.status === 'running') {
				document.title = `(${formatted}) OnScreenTimer`;
			} else if (timer.status === 'paused') {
				document.title = `(Paused ${formatted}) OnScreenTimer`;
			} else {
				document.title = originalTitle;
			}

			// Modern
			if (modernTimeText) modernTimeText.textContent = formatted;
			if (modernTimePeriod) modernTimePeriod.classList.add('hidden');
			displayModern?.setAttribute('aria-label', `Timer: ${formatted}`);

			// Digital
			if (digitalSvgContainer && style === 'digital') {
				digitalSvgContainer.innerHTML = renderDigitalSvg(formatted);
			}

			// Analog
			if (style === 'analog') {
				const angles = calculateDurationAngles(timer.remainingSeconds);
				setHandRotation(handHour, angles.hourAngle);
				setHandRotation(handMinute, angles.minuteAngle);
				setHandRotation(handSecondGroup, angles.secondAngle);

				if (analogNumericalReadout) {
					analogNumericalReadout.textContent = formatted;
					analogNumericalReadout.classList.remove('hidden');
				}
			}
		} else if (mode === 'stopwatch') {
			const formatted = formatDuration(stopwatch.elapsedSeconds);

			// Browser Tab Title (Stopwatch)
			if (stopwatch.status === 'running') {
				document.title = `(${formatted}) OnScreenTimer`;
			} else if (stopwatch.status === 'paused') {
				document.title = `(Paused ${formatted}) OnScreenTimer`;
			} else {
				document.title = originalTitle;
			}

			// Modern
			if (modernTimeText) modernTimeText.textContent = formatted;
			if (modernTimePeriod) modernTimePeriod.classList.add('hidden');
			displayModern?.setAttribute('aria-label', `Stopwatch: ${formatted}`);

			// Digital
			if (digitalSvgContainer && style === 'digital') {
				digitalSvgContainer.innerHTML = renderDigitalSvg(formatted);
			}

			// Analog (Strictly clockwise with increasing elapsed duration)
			if (style === 'analog') {
				const angles = calculateStopwatchAngles(stopwatch.elapsedSeconds);
				setHandRotation(handHour, angles.hourAngle);
				setHandRotation(handMinute, angles.minuteAngle);
				setHandRotation(handSecondGroup, angles.secondAngle);

				if (analogNumericalReadout) {
					analogNumericalReadout.textContent = formatted;
					analogNumericalReadout.classList.remove('hidden');
				}
			}
		} else if (mode === 'clock') {
			// Browser Tab Title (Clock - keep steady per requirements)
			document.title = originalTitle;

			const hh = String(clock.hours).padStart(2, '0');
			const mm = String(clock.minutes).padStart(2, '0');
			const ss = String(clock.seconds).padStart(2, '0');
			const timeFormatted = `${hh}:${mm}:${ss}`;

			// Modern
			if (modernTimeText) modernTimeText.textContent = timeFormatted;
			if (modernTimePeriod) {
				if (clock.format === '12h') {
					modernTimePeriod.textContent = clock.isAm ? 'AM' : 'PM';
					modernTimePeriod.classList.remove('hidden');
				} else {
					modernTimePeriod.classList.add('hidden');
				}
			}
			displayModern?.setAttribute('aria-label', `Clock: ${clock.formatted}`);

			// Digital
			if (digitalSvgContainer && style === 'digital') {
				const ampm = clock.format === '12h' ? (clock.isAm ? 'AM' : 'PM') : null;
				digitalSvgContainer.innerHTML = renderDigitalSvg(timeFormatted, ampm);
			}

			// Analog (Clock hands advance clockwise with local time)
			if (style === 'analog') {
				const angles = calculateClockAngles(clock.hours, clock.minutes, clock.seconds);
				setHandRotation(handHour, angles.hourAngle);
				setHandRotation(handMinute, angles.minuteAngle);
				setHandRotation(handSecondGroup, angles.secondAngle);

				// Standard analog clock has no redundant digital sub-readout
				if (analogNumericalReadout) {
					analogNumericalReadout.classList.add('hidden');
				}
			}
		}

		// --- D. Timer Primary Button (Start / Pause / Resume) ---
		if (btnTimerPrimary) {
			if (timer.status === 'running') {
				btnTimerPrimary.textContent = 'Pause';
				btnTimerPrimary.setAttribute('aria-label', 'Pause timer');
				btnTimerPrimary.classList.remove('bg-blue-600', 'dark:bg-blue-500');
				btnTimerPrimary.classList.add('bg-zinc-800', 'dark:bg-zinc-200', 'text-white', 'dark:text-zinc-950');
			} else if (timer.status === 'paused') {
				btnTimerPrimary.textContent = 'Resume';
				btnTimerPrimary.setAttribute('aria-label', 'Resume timer');
				btnTimerPrimary.classList.remove('bg-zinc-800', 'dark:bg-zinc-200', 'text-white', 'dark:text-zinc-950');
				btnTimerPrimary.classList.add('bg-blue-600', 'dark:bg-blue-500', 'text-white');
			} else {
				btnTimerPrimary.textContent = 'Start';
				btnTimerPrimary.setAttribute('aria-label', 'Start timer');
				btnTimerPrimary.classList.remove('bg-zinc-800', 'dark:bg-zinc-200', 'text-white', 'dark:text-zinc-950');
				btnTimerPrimary.classList.add('bg-blue-600', 'dark:bg-blue-500', 'text-white');
			}
		}

		// --- E. Timer Reset & Stop Buttons ---
		if (btnTimerReset) {
			const isAtIdleInitial = timer.status === 'idle' && timer.remainingSeconds === timer.initialDurationSeconds;
			btnTimerReset.disabled = isAtIdleInitial;
		}

		if (btnTimerStop) {
			const isSessionActive = timer.status === 'running' || timer.status === 'paused';
			btnTimerStop.disabled = !isSessionActive;
		}

		if (timerInput) {
			timerInput.disabled = timer.status === 'running' || timer.status === 'paused';
		}

		// --- F. Stopwatch Primary Button (Start / Pause / Resume) ---
		if (btnStopwatchPrimary) {
			if (stopwatch.status === 'running') {
				btnStopwatchPrimary.textContent = 'Pause';
				btnStopwatchPrimary.setAttribute('aria-label', 'Pause stopwatch');
				btnStopwatchPrimary.classList.remove('bg-blue-600', 'dark:bg-blue-500');
				btnStopwatchPrimary.classList.add('bg-zinc-800', 'dark:bg-zinc-200', 'text-white', 'dark:text-zinc-950');
			} else if (stopwatch.status === 'paused') {
				btnStopwatchPrimary.textContent = 'Resume';
				btnStopwatchPrimary.setAttribute('aria-label', 'Resume stopwatch');
				btnStopwatchPrimary.classList.remove('bg-zinc-800', 'dark:bg-zinc-200', 'text-white', 'dark:text-zinc-950');
				btnStopwatchPrimary.classList.add('bg-blue-600', 'dark:bg-blue-500', 'text-white');
			} else {
				btnStopwatchPrimary.textContent = 'Start';
				btnStopwatchPrimary.setAttribute('aria-label', 'Start stopwatch');
				btnStopwatchPrimary.classList.remove('bg-zinc-800', 'dark:bg-zinc-200', 'text-white', 'dark:text-zinc-950');
				btnStopwatchPrimary.classList.add('bg-blue-600', 'dark:bg-blue-500', 'text-white');
			}
		}

		// --- G. Stopwatch Reset & Stop Buttons ---
		if (btnStopwatchReset) {
			btnStopwatchReset.disabled = stopwatch.status === 'idle' && stopwatch.elapsedSeconds === 0;
		}

		if (btnStopwatchStop) {
			btnStopwatchStop.disabled = stopwatch.status !== 'running' && stopwatch.status !== 'paused';
		}

		// --- H. Mode / Style Dropdown Checks ---
		document.querySelectorAll('#mode-dropdown-menu [data-mode]').forEach((btn) => {
			const btnMode = btn.getAttribute('data-mode');
			const isMatch = btnMode === mode;
			btn.setAttribute('aria-checked', isMatch ? 'true' : 'false');
			const check = btn.querySelector('.mode-check');
			if (check) {
				if (isMatch) check.classList.remove('hidden');
				else check.classList.add('hidden');
			}
		});

		document.querySelectorAll('#style-dropdown-menu [data-style]').forEach((btn) => {
			const btnStyle = btn.getAttribute('data-style');
			const isMatch = btnStyle === style;
			btn.setAttribute('aria-checked', isMatch ? 'true' : 'false');
			const check = btn.querySelector('.style-check');
			if (check) {
				if (isMatch) check.classList.remove('hidden');
				else check.classList.add('hidden');
			}
		});

		const modeCap = mode.charAt(0).toUpperCase() + mode.slice(1);
		const styleCap = style.charAt(0).toUpperCase() + style.slice(1);
		btnModeDropdown?.setAttribute('aria-label', `Select mode, currently ${modeCap}`);
		btnStyleDropdown?.setAttribute('aria-label', `Select style, currently ${styleCap}`);
	});

	// 5. Timer Input Handling (Preserving Phase 2 behavior)
	function handleTimerDurationInput(shouldStart: boolean = false) {
		const raw = timerInput?.value.trim() ?? '';
		if (!raw) {
			setTimerInputError(shouldStart ? 'Please enter a duration (e.g. 5, 2mins, 02:00, 90s)' : null);
			store.setState((prev) => ({
				...prev,
				timer: {
					...prev.timer,
					initialDurationSeconds: 0,
					remainingSeconds: 0,
					remainingMs: 0,
					rawInput: ''
				}
			}));
			timerEngine.setDuration(0);
			return false;
		}

		const parsed = parseDuration(raw);

		if (!parsed.ok) {
			setTimerInputError(parsed.error);
			return false;
		}

		setTimerInputError(null);
		store.setState((prev) => ({
			...prev,
			timer: {
				...prev.timer,
				initialDurationSeconds: parsed.seconds,
				rawInput: raw
			}
		}));

		if (shouldStart) {
			timerEngine.start(parsed.seconds);
		} else {
			timerEngine.setDuration(parsed.seconds);
		}

		return true;
	}

	timerInput?.addEventListener('input', () => {
		const status = timerEngine.getStatus();
		if (status === 'idle' || status === 'completed') {
			const raw = timerInput.value.trim();
			if (!raw) {
				setTimerInputError(null);
				store.setState((prev) => ({
					...prev,
					timer: {
						...prev.timer,
						initialDurationSeconds: 0,
						remainingSeconds: 0,
						remainingMs: 0,
						rawInput: ''
					}
				}));
				timerEngine.setDuration(0);
				return;
			}
			const parsed = parseDuration(raw);
			if (parsed.ok) {
				setTimerInputError(null);
				store.setState((prev) => ({
					...prev,
					timer: {
						...prev.timer,
						initialDurationSeconds: parsed.seconds,
						rawInput: raw
					}
				}));
				timerEngine.setDuration(parsed.seconds);
			}
		}
	});

	timerInput?.addEventListener('change', () => {
		const status = timerEngine.getStatus();
		if (status === 'idle' || status === 'completed') {
			handleTimerDurationInput(false);
		}
	});

	timerForm?.addEventListener('submit', (e) => {
		e.preventDefault();
		const status = timerEngine.getStatus();
		if (status === 'idle' || status === 'completed') {
			handleTimerDurationInput(true);
		}
	});

	btnTimerPrimary?.addEventListener('click', () => {
		const status = timerEngine.getStatus();

		if (status === 'running') {
			timerEngine.pause();
			return;
		}

		if (status === 'paused') {
			timerEngine.resume();
			return;
		}

		const ok = handleTimerDurationInput(true);
		if (!ok && timerInput) {
			timerInput.focus();
		}
	});

	btnTimerReset?.addEventListener('click', () => {
		setTimerInputError(null);
		timerEngine.reset();
	});

	btnTimerStop?.addEventListener('click', () => {
		setTimerInputError(null);
		timerEngine.stop();
	});

	// 6. Stopwatch Controls Listeners
	btnStopwatchPrimary?.addEventListener('click', () => {
		const status = stopwatchEngine.getStatus();
		if (status === 'running') {
			stopwatchEngine.pause();
		} else if (status === 'paused') {
			stopwatchEngine.resume();
		} else {
			stopwatchEngine.start();
		}
	});

	btnStopwatchReset?.addEventListener('click', () => {
		stopwatchEngine.reset();
	});

	btnStopwatchStop?.addEventListener('click', () => {
		stopwatchEngine.stop();
	});

	// 7. Mode & Style Dropdown Management
	function closeDropdowns() {
		modeDropdownMenu?.classList.add('hidden');
		btnModeDropdown?.setAttribute('aria-expanded', 'false');
		styleDropdownMenu?.classList.add('hidden');
		btnStyleDropdown?.setAttribute('aria-expanded', 'false');
	}

	btnModeDropdown?.addEventListener('click', (e) => {
		e.stopPropagation();
		const isExpanded = btnModeDropdown.getAttribute('aria-expanded') === 'true';
		closeDropdowns();
		if (!isExpanded && modeDropdownMenu) {
			modeDropdownMenu.classList.remove('hidden');
			btnModeDropdown.setAttribute('aria-expanded', 'true');
		}
	});

	btnStyleDropdown?.addEventListener('click', (e) => {
		e.stopPropagation();
		const isExpanded = btnStyleDropdown.getAttribute('aria-expanded') === 'true';
		closeDropdowns();
		if (!isExpanded && styleDropdownMenu) {
			styleDropdownMenu.classList.remove('hidden');
			btnStyleDropdown.setAttribute('aria-expanded', 'true');
		}
	});

	// Mode selection
	document.querySelectorAll('#mode-dropdown-menu [data-mode]').forEach((btn) => {
		btn.addEventListener('click', (e) => {
			e.stopPropagation();
			const newMode = btn.getAttribute('data-mode') as AppMode | null;
			if (newMode) {
				store.setState({ mode: newMode });
			}
			closeDropdowns();
			btnModeDropdown?.focus();
		});
	});

	// Style selection
	document.querySelectorAll('#style-dropdown-menu [data-style]').forEach((btn) => {
		btn.addEventListener('click', (e) => {
			e.stopPropagation();
			const newStyle = btn.getAttribute('data-style') as DisplayStyle | null;
			if (newStyle) {
				store.setState({ style: newStyle });
			}
			closeDropdowns();
			btnStyleDropdown?.focus();
		});
	});

	// Close dropdowns on outside click or Escape key
	document.addEventListener('click', (e) => {
		const target = e.target as Node | null;
		if (
			modeDropdownContainer &&
			!modeDropdownContainer.contains(target) &&
			styleDropdownContainer &&
			!styleDropdownContainer.contains(target)
		) {
			closeDropdowns();
		}
	});

	document.addEventListener('keydown', (e) => {
		if (e.key === 'Escape') {
			closeDropdowns();
		}
	});

	// 8. Initial View State Initialization
	if (timerInput) timerInput.value = '';
	if (modernTimeText) modernTimeText.textContent = '00:00';
	btnTimerReset.disabled = true;
	btnTimerStop.disabled = true;
	if (btnStopwatchReset) btnStopwatchReset.disabled = true;
	if (btnStopwatchStop) btnStopwatchStop.disabled = true;

	return {
		store,
		timerEngine,
		stopwatchEngine,
		clockEngine
	};
}
