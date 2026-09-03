import { createStore } from './store';
import { TimerEngine } from './timer-engine';
import { parseDuration, formatDuration } from './parser';
import type { AppState, TimerStatus } from './types';

export function initTimerController() {
	// DOM Elements
	const displayEl = document.getElementById('timer-display');
	const inputEl = document.getElementById('timer-input') as HTMLInputElement | null;
	const errorEl = document.getElementById('timer-input-error');
	const formEl = document.getElementById('timer-form') as HTMLFormElement | null;
	const btnPrimary = document.getElementById('btn-timer-primary') as HTMLButtonElement | null;
	const btnReset = document.getElementById('btn-timer-reset') as HTMLButtonElement | null;
	const btnStop = document.getElementById('btn-timer-stop') as HTMLButtonElement | null;
	const originalTitle = document.title;

	if (!displayEl || !inputEl || !btnPrimary || !btnReset || !btnStop) {
		// Workspace elements not on this page or not yet rendered
		return;
	}

	// Application State Store - Initially empty duration (00:00) on fresh load
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
		}
	});

	// Timer Engine instance
	const engine = new TimerEngine({
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
			// Subtle completion feedback (sound deferred to later phase)
			displayEl.classList.add('text-blue-600', 'dark:text-blue-400');
			setTimeout(() => {
				displayEl.classList.remove('text-blue-600', 'dark:text-blue-400');
			}, 1500);
		},
		onSessionStop: () => {
			// Hook reserved for Current Task completion in later phases
		}
	});

	// Helper to show/clear input validation errors
	function setInputError(msg: string | null) {
		store.setState((prev) => ({
			...prev,
			timer: {
				...prev.timer,
				inputError: msg
			}
		}));

		if (errorEl) {
			if (msg) {
				errorEl.textContent = msg;
				errorEl.classList.remove('hidden');
				inputEl?.setAttribute('aria-invalid', 'true');
			} else {
				errorEl.textContent = '';
				errorEl.classList.add('hidden');
				inputEl?.removeAttribute('aria-invalid');
			}
		}
	}

	// Update DOM when state changes
	store.subscribe((state, prevState) => {
		const { status, remainingSeconds, initialDurationSeconds } = state.timer;
		const formatted = formatDuration(remainingSeconds);

		// 1. Update Display
		displayEl.textContent = formatted;
		displayEl.setAttribute('aria-label', `Timer: ${formatted}`);

		// 2. Update Browser Title
		if (status === 'running') {
			document.title = `(${formatted}) OnScreenTimer`;
		} else if (status === 'paused') {
			document.title = `(Paused ${formatted}) OnScreenTimer`;
		} else {
			document.title = originalTitle;
		}

		// 3. Update Primary Button (Start / Pause / Resume)
		if (status === 'running') {
			btnPrimary.textContent = 'Pause';
			btnPrimary.setAttribute('aria-label', 'Pause timer');
			btnPrimary.classList.remove('bg-blue-600', 'dark:bg-blue-500');
			btnPrimary.classList.add('bg-zinc-800', 'dark:bg-zinc-200', 'text-white', 'dark:text-zinc-950');
		} else if (status === 'paused') {
			btnPrimary.textContent = 'Resume';
			btnPrimary.setAttribute('aria-label', 'Resume timer');
			btnPrimary.classList.remove('bg-zinc-800', 'dark:bg-zinc-200', 'text-white', 'dark:text-zinc-950');
			btnPrimary.classList.add('bg-blue-600', 'dark:bg-blue-500', 'text-white');
		} else {
			btnPrimary.textContent = 'Start';
			btnPrimary.setAttribute('aria-label', 'Start timer');
			btnPrimary.classList.remove('bg-zinc-800', 'dark:bg-zinc-200', 'text-white', 'dark:text-zinc-950');
			btnPrimary.classList.add('bg-blue-600', 'dark:bg-blue-500', 'text-white');
		}

		// 4. Update Reset Button
		// Reset is enabled whenever timer is not at its clean idle starting state
		const isAtIdleInitial = status === 'idle' && remainingSeconds === initialDurationSeconds;
		btnReset.disabled = isAtIdleInitial;

		// 5. Update Stop Button
		// Stop is enabled when a session is active (running or paused)
		const isSessionActive = status === 'running' || status === 'paused';
		btnStop.disabled = !isSessionActive;

		// 6. Update Input disabled state
		// Lock input during running/paused to prevent desync
		inputEl.disabled = status === 'running' || status === 'paused';
	});

	// Handle input changes from idle / completed state
	function handleDurationInput(shouldStart: boolean = false) {
		const raw = inputEl?.value.trim() ?? '';
		if (!raw) {
			setInputError(shouldStart ? 'Please enter a duration (e.g. 5, 2mins, 02:00, 90s)' : null);
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
			engine.setDuration(0);
			return false;
		}

		const parsed = parseDuration(raw);

		if (!parsed.ok) {
			setInputError(parsed.error);
			return false;
		}

		setInputError(null);
		store.setState((prev) => ({
			...prev,
			timer: {
				...prev.timer,
				initialDurationSeconds: parsed.seconds,
				rawInput: raw
			}
		}));

		if (shouldStart) {
			engine.start(parsed.seconds);
		} else {
			engine.setDuration(parsed.seconds);
		}

		return true;
	}

	// Input listeners
	inputEl.addEventListener('input', () => {
		const status = engine.getStatus();
		if (status === 'idle' || status === 'completed') {
			// Validate as user types, update display if valid or return to 00:00 if cleared
			const raw = inputEl.value.trim();
			if (!raw) {
				setInputError(null);
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
				engine.setDuration(0);
				return;
			}
			const parsed = parseDuration(raw);
			if (parsed.ok) {
				setInputError(null);
				store.setState((prev) => ({
					...prev,
					timer: {
						...prev.timer,
						initialDurationSeconds: parsed.seconds,
						rawInput: raw
					}
				}));
				engine.setDuration(parsed.seconds);
			}
		}
	});

	inputEl.addEventListener('change', () => {
		const status = engine.getStatus();
		if (status === 'idle' || status === 'completed') {
			handleDurationInput(false);
		}
	});

	formEl?.addEventListener('submit', (e) => {
		e.preventDefault();
		const status = engine.getStatus();
		if (status === 'idle' || status === 'completed') {
			handleDurationInput(true);
		}
	});

	// Primary Button (Start / Pause / Resume)
	btnPrimary.addEventListener('click', () => {
		const status = engine.getStatus();

		if (status === 'running') {
			engine.pause();
			return;
		}

		if (status === 'paused') {
			engine.resume();
			return;
		}

		// Status is 'idle' or 'completed'
		const ok = handleDurationInput(true);
		if (!ok && inputEl) {
			inputEl.focus();
		}
	});

	// Reset Button
	btnReset.addEventListener('click', () => {
		setInputError(null);
		engine.reset();
	});

	// Stop Button
	btnStop.addEventListener('click', () => {
		setInputError(null);
		engine.stop();
	});

	// Initialize UI with empty/zero state on fresh load
	inputEl.value = '';
	displayEl.textContent = '00:00';
	displayEl.setAttribute('aria-label', 'Timer: 00:00');
	btnReset.disabled = true;
	btnStop.disabled = true;

	return {
		store,
		engine
	};
}
