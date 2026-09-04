import { createStore } from './store.ts';
import { TimerEngine } from './timer-engine.ts';
import { StopwatchEngine } from './stopwatch-engine.ts';
import { ClockEngine } from './clock-engine.ts';
import { parseDuration, formatDuration } from './parser.ts';
import {
	renderDigitalSvg,
	calculateClockAngles,
	calculateDurationAngles,
	calculateStopwatchAngles
} from './renderers.ts';
import { taskActionReducer, engineStatusReducer } from './task-logic.ts';
import { serializeState, hydrateState } from './persistence.ts';
import { AudioSystem } from './audio.ts';
import type { AppState, AppMode, DisplayStyle, TimerStatus, StopwatchStatus, Task } from './types.ts';
import { STUDY_PRESETS } from './presets.ts';

export function initWorkspaceController(config?: { overrideTimerDuration?: number }) {
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
	const analogAmPmBadge = document.getElementById('analog-ampm-badge');

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

	// Task Elements
	const todoForm = document.getElementById('todo-form') as HTMLFormElement | null;
	const todoInput = document.getElementById('todo-input') as HTMLInputElement | null;
	const todoList = document.getElementById('todo-list');
	const currentTaskContainer = document.getElementById('current-task-container');
	const btnDesktopTodoReopen = document.getElementById('btn-desktop-todo-reopen');
	const btnDesktopTodoMinimize = document.getElementById('btn-desktop-todo-minimize');
	const btnMobileTodoToggle = document.getElementById('btn-mobile-todo-toggle');
	const todoMobileChevron = document.getElementById('todo-mobile-chevron');
	const todoMobileCount = document.getElementById('todo-mobile-count');
	const todoPanel = document.getElementById('todo-panel');
	const todoContent = document.getElementById('todo-content');
	const todoSummary = document.getElementById('todo-summary');
	const countDone = document.getElementById('count-done');
	const countRemaining = document.getElementById('count-remaining');
	
	// Burger Menu Elements
	const burgerMenuOverlay = document.getElementById('burger-menu-overlay');
	const burgerMenuPanel = document.getElementById('burger-menu-panel');
	const btnMenu = document.getElementById('btn-menu');
	const btnCloseMenu = document.getElementById('btn-close-menu');
	const btnClock12h = document.getElementById('btn-clock-12h');
	const btnClock24h = document.getElementById('btn-clock-24h');

	if (!displayModern || !btnTimerPrimary || !btnTimerReset || !btnTimerStop || !timerInput) {
		// Elements not yet in DOM
		return;
	}

	// 1. Unified State Store & Hydration
	const audioSystem = new AudioSystem();
	const now = Date.now();
	let hydratedState = null;
	try {
		hydratedState = hydrateState(localStorage.getItem('ost_state'), now);
	} catch (e) {
		// Ignore storage access errors
	}

	if (config?.overrideTimerDuration) {
		const isStrongTimerState = hydratedState && (hydratedState.timer.status === 'running' || hydratedState.timer.status === 'paused');
		if (!isStrongTimerState) {
			if (!hydratedState) {
				hydratedState = {
					mode: 'timer',
					style: 'modern',
					size: 'mid',
					soundEnabled: false,
					timer: {
						status: 'idle',
						initialDurationSeconds: 0,
						remainingSeconds: 0,
						remainingMs: 0,
						rawInput: '',
						inputError: null
					},
					clock: {
						format: '24h',
						hours: 12,
						minutes: 0,
						seconds: 0,
						isAm: true,
						formatted: '12:00:00'
					},
					stopwatch: {
						status: 'idle',
						elapsedSeconds: 0,
						elapsedMs: 0
					},
					tasks: [],
					activeSessionEngine: null,
					todoMinimized: typeof window !== 'undefined' ? window.innerWidth < 1024 : false,
					clockFormat: '24h',
					activePresetId: null,
					activeSegmentIndex: 0
				};
			}
			hydratedState.mode = 'timer';
			hydratedState.timer = {
				status: 'idle',
				initialDurationSeconds: config.overrideTimerDuration,
				remainingSeconds: config.overrideTimerDuration,
				remainingMs: config.overrideTimerDuration * 1000,
				rawInput: '', // Clear the visual input so they don't see raw text
				inputError: null
			};
			hydratedState.activePresetId = null;
			hydratedState.activeSegmentIndex = 0;
		}
	} else if (hydratedState) {
		// We are on a normal page (e.g. homepage).
		// Prevent idle/completed route-supplied timers from contaminating the global default.
		const isStrongTimerState = hydratedState.timer.status === 'running' || hydratedState.timer.status === 'paused';
		if (!isStrongTimerState) {
			hydratedState.timer.status = 'idle';
			hydratedState.timer.initialDurationSeconds = 0;
			hydratedState.timer.remainingMs = 0;
			hydratedState.timer.rawInput = '';
			hydratedState.timer.inputError = null;
		}
	}

	const initialState: AppState = {
		mode: hydratedState?.mode ?? 'timer',
		style: hydratedState?.style ?? 'modern',
		size: hydratedState?.size ?? 'mid',
		soundEnabled: hydratedState?.soundEnabled ?? false,
		timer: {
			status: hydratedState?.timer.status ?? 'idle',
			initialDurationSeconds: hydratedState?.timer.initialDurationSeconds ?? 0,
			remainingSeconds: Math.ceil((hydratedState?.timer.remainingMs ?? 0) / 1000),
			remainingMs: hydratedState?.timer.remainingMs ?? 0,
			rawInput: hydratedState?.timer.initialDurationSeconds ? String(hydratedState.timer.initialDurationSeconds) : '',
			inputError: null
		},
		clock: {
			format: hydratedState?.clockFormat ?? '24h',
			hours: 12,
			minutes: 0,
			seconds: 0,
			isAm: true,
			formatted: '12:00:00'
		},
		stopwatch: {
			status: hydratedState?.stopwatch.status ?? 'idle',
			elapsedSeconds: Math.floor((hydratedState?.stopwatch.accumulatedMs ?? 0) / 1000),
			elapsedMs: hydratedState?.stopwatch.accumulatedMs ?? 0
		},
		tasks: hydratedState?.tasks ?? [],
		activeSessionEngine: hydratedState?.activeSessionEngine ?? null,
		todoMinimized: hydratedState?.todoMinimized ?? (typeof window !== 'undefined' ? window.innerWidth < 1024 : false),
		clockFormat: hydratedState?.clockFormat ?? '24h',
		activePresetId: hydratedState?.activePresetId ?? null,
		activeSegmentIndex: hydratedState?.activeSegmentIndex ?? 0
	};

	let previousNonFullSize: import('./types').DisplaySize = hydratedState?.previousNonFullSize ?? (initialState.size === 'full' ? 'mid' : initialState.size);

	const store = createStore<AppState>(initialState);

	function persistState() {
		try {
			const state = store.getState();
			const serialized = serializeState({
				mode: state.mode,
				style: state.style,
				size: state.size,
				previousNonFullSize,
				soundEnabled: state.soundEnabled,
				timer: timerEngine.getSnapshot(),
				stopwatch: stopwatchEngine.getSnapshot(),
				tasks: state.tasks,
				activeSessionEngine: state.activeSessionEngine,
				todoMinimized: state.todoMinimized,
				clockFormat: state.clockFormat,
				activePresetId: state.activePresetId,
				activeSegmentIndex: state.activeSegmentIndex
			});
			localStorage.setItem('ost_state', serialized);
		} catch (e) {
			// ignore
		}
	}

	window.addEventListener('pagehide', persistState);

	// 2. Task Engine Ownership & Lifecycle
	function handleEngineStatusChange(engine: 'timer' | 'stopwatch', status: TimerStatus | StopwatchStatus) {
		store.setState((prev) => engineStatusReducer(prev, engine, status, Date.now()));
	}

	// 3. Engines Initialization
	const timerEngine = new TimerEngine({
		initialDurationSeconds: 0,
		onTick: (remainingSeconds, remainingMs) => {
			store.setState((prev) => ({
				...prev,
				timer: { ...prev.timer, remainingSeconds, remainingMs }
			}));
		},
		onStatusChange: (status: TimerStatus) => {
			handleEngineStatusChange('timer', status);
			store.setState((prev) => ({
				...prev,
				timer: { 
					...prev.timer, 
					status, 
					initialDurationSeconds: timerEngine.getInitialDurationSeconds() 
				}
			}));
			persistState();
		},
		onComplete: () => {
			modernTimeText?.classList.add('text-blue-600', 'dark:text-blue-400');
			setTimeout(() => {
				modernTimeText?.classList.remove('text-blue-600', 'dark:text-blue-400');
			}, 1500);
			audioSystem.playCompletionSound(!store.getState().soundEnabled);
			
			// Preset Progression
			const state = store.getState();
			if (state.activePresetId) {
				const preset = STUDY_PRESETS.find(p => p.id === state.activePresetId);
				if (preset && state.activeSegmentIndex < preset.segments.length - 1) {
					// Advance to next segment immediately
					const nextIndex = state.activeSegmentIndex + 1;
					store.setState(prev => ({ ...prev, activeSegmentIndex: nextIndex }));
					timerEngine.setDuration(preset.segments[nextIndex].durationSeconds);
					timerEngine.start();
				} else if (preset && state.activeSegmentIndex === preset.segments.length - 1) {
					// Final segment reached zero
					store.setState(prev => ({ ...prev, activePresetId: null, activeSegmentIndex: 0 }));
					const presetPhaseLabel = document.getElementById('preset-phase-label');
					if (presetPhaseLabel) {
						presetPhaseLabel.textContent = 'Block complete';
						presetPhaseLabel.classList.remove('hidden');
						setTimeout(() => {
							updatePresetLabel(store.getState());
						}, 3000);
					}
				}
			}
		}
	});
	if (hydratedState) {
		timerEngine.hydrate(hydratedState.timer);
	}

	const stopwatchEngine = new StopwatchEngine({
		onTick: (elapsedSeconds, elapsedMs) => {
			store.setState((prev) => ({
				...prev,
				stopwatch: { ...prev.stopwatch, elapsedSeconds, elapsedMs }
			}));
		},
		onStatusChange: (status: StopwatchStatus) => {
			handleEngineStatusChange('stopwatch', status);
			store.setState((prev) => ({
				...prev,
				stopwatch: { ...prev.stopwatch, status }
			}));
			persistState();
		}
	});
	if (hydratedState) {
		stopwatchEngine.hydrate(hydratedState.stopwatch);
	}

	const clockEngine = new ClockEngine({
		initialFormat: initialState.clockFormat,
		onTick: (clockState) => {
			store.setState((prev) => ({
				...prev,
				clock: clockState
			}));
		}
	});

	clockEngine.start();

	// 4. Task Management
	function generateTaskId() {
		return Math.random().toString(36).substring(2, 9);
	}

	function handleTaskAction(action: string, taskId: string) {
		const nextState = taskActionReducer(store.getState(), action, taskId, Date.now());
		store.setState(nextState);

		const state = store.getState();
		if (action === 'complete' && state.tasks.length > 0 && state.tasks.every(t => t.status === 'completed')) {
			audioSystem.playCompletionSound(!state.soundEnabled);
			if (state.activeSessionEngine === 'timer') {
				timerEngine.stop();
			} else if (state.activeSessionEngine === 'stopwatch') {
				stopwatchEngine.stop();
			}
		}
		persistState();
	}

	todoForm?.addEventListener('submit', (e) => {
		e.preventDefault();
		const raw = todoInput?.value.trim() ?? '';
		if (!raw) return;
		
		const newTask = {
			id: generateTaskId(),
			text: raw,
			status: 'pending' as const,
			elapsedMs: 0,
			startTime: null
		};
		
		store.setState(prev => ({ tasks: [...prev.tasks, newTask] }));
		if (todoInput) todoInput.value = '';
		persistState();
	});

	// Task action delegation
	todoList?.addEventListener('click', (e) => {
		const target = (e.target as HTMLElement).closest('button[data-task-action]');
		if (target) {
			const action = target.getAttribute('data-task-action');
			const taskId = target.getAttribute('data-task-id');
			if (action && taskId) handleTaskAction(action, taskId);
		}
	});

	currentTaskContainer?.addEventListener('click', (e) => {
		const target = (e.target as HTMLElement).closest('button[data-task-action]');
		if (target) {
			const action = target.getAttribute('data-task-action');
			const taskId = target.getAttribute('data-task-id');
			if (action && taskId) handleTaskAction(action, taskId);
		}
	});

	// 4b. Burger Menu & Settings
	function openMenu() {
		burgerMenuOverlay?.classList.remove('hidden');
		burgerMenuPanel?.classList.remove('translate-x-full');
		void burgerMenuPanel?.offsetWidth; // reflow
		burgerMenuOverlay?.classList.remove('opacity-0');
	}
	
	function closeMenu() {
		burgerMenuOverlay?.classList.add('opacity-0');
		burgerMenuPanel?.classList.add('translate-x-full');
		setTimeout(() => {
			burgerMenuOverlay?.classList.add('hidden');
		}, 300);
	}
	
	btnMenu?.addEventListener('click', openMenu);
	btnCloseMenu?.addEventListener('click', closeMenu);
	burgerMenuOverlay?.addEventListener('click', closeMenu);

	btnClock12h?.addEventListener('click', () => {
		store.setState(prev => ({ ...prev, clockFormat: '12h' }));
		clockEngine.setFormat('12h');
		persistState();
	});
	btnClock24h?.addEventListener('click', () => {
		store.setState(prev => ({ ...prev, clockFormat: '24h' }));
		clockEngine.setFormat('24h');
		persistState();
	});

	// 4c. To-do Panel Toggles (Mobile & Desktop)
	function syncTodoMinimizedState(state: AppState) {
		// Desktop minimization
		if (state.todoMinimized) {
			todoContent?.classList.add('hidden');
			todoContent?.classList.remove('lg:flex');
			todoPanel?.classList.remove('lg:flex');
			todoPanel?.classList.add('lg:hidden');
			btnDesktopTodoReopen?.classList.remove('hidden');
			btnDesktopTodoReopen?.classList.add('flex');
		} else {
			todoContent?.classList.remove('hidden');
			todoContent?.classList.add('lg:flex');
			todoPanel?.classList.add('lg:flex');
			todoPanel?.classList.remove('lg:hidden');
			btnDesktopTodoReopen?.classList.add('hidden');
			btnDesktopTodoReopen?.classList.remove('flex');
		}

		// Mobile expand/collapse (uses the same minimized state concept, but applies to mobile view)
		if (state.todoMinimized) {
			todoContent?.classList.add('hidden');
			todoMobileChevron?.classList.remove('rotate-180');
			btnMobileTodoToggle?.setAttribute('aria-expanded', 'false');
		} else {
			todoContent?.classList.remove('hidden');
			todoMobileChevron?.classList.add('rotate-180');
			btnMobileTodoToggle?.setAttribute('aria-expanded', 'true');
		}
	}

	btnDesktopTodoMinimize?.addEventListener('click', () => {
		store.setState(prev => ({ ...prev, todoMinimized: true }));
		persistState();
	});

	btnDesktopTodoReopen?.addEventListener('click', () => {
		store.setState(prev => ({ ...prev, todoMinimized: false }));
		persistState();
	});

	btnMobileTodoToggle?.addEventListener('click', () => {
		const isMin = store.getState().todoMinimized;
		store.setState(prev => ({ ...prev, todoMinimized: !isMin }));
		persistState();
	});

	// 5. Helper: Timer validation errors
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

	function formatTaskTime(ms: number) {
		const totalSeconds = Math.floor(ms / 1000);
		const m = Math.floor(totalSeconds / 60);
		const s = totalSeconds % 60;
		if (m >= 60) {
			const h = Math.floor(m / 60);
			const mm = m % 60;
			return `${h}:${String(mm).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
		}
		return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
	}

	function renderTodoList(tasks: typeof store.getState extends () => { tasks: infer T } ? T : any[]) {
		if (!todoList) return;
		
		const unfinished = tasks.filter(t => t.status !== 'completed');
		const completed = tasks.filter(t => t.status === 'completed');
		const displayTasks = [...unfinished, ...completed];
		
		// Update summary counts
		const countDoneVal = completed.length;
		const countRemVal = unfinished.length;
		if (countDone) countDone.textContent = String(countDoneVal);
		if (countRemaining) countRemaining.textContent = String(countRemVal);
		if (todoMobileCount) {
			todoMobileCount.textContent = countRemVal > 0 ? `(${countRemVal})` : '';
		}
		
		if (todoSummary) {
			if (tasks.length === 0) {
				todoSummary.classList.add('hidden');
			} else {
				todoSummary.classList.remove('hidden');
			}
		}

		todoList.innerHTML = displayTasks.map(t => {
			const isCurrent = t.status === 'current';
			const isCompleted = t.status === 'completed';
			const isPending = t.status === 'pending';
			
			let rowClass = "group flex items-center justify-between p-2 rounded-lg border text-sm transition-colors ";
			if (isCurrent) {
				rowClass += "bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-950 border-transparent shadow-sm";
			} else if (isCompleted) {
				rowClass += "bg-zinc-50/50 dark:bg-zinc-900/30 text-zinc-500 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800";
			} else {
				rowClass += "bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700";
			}

			const indicatorColor = isCurrent ? "bg-amber-400" : isCompleted ? "bg-emerald-500" : "bg-rose-400";
			
			let actions = '';
			if (isPending) {
				actions = `
					<button type="button" data-task-action="make-current" data-task-id="${t.id}" class="hidden group-hover:flex items-center justify-center w-6 h-6 rounded text-zinc-400 hover:text-amber-500 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-500" aria-label="Make current" title="Make current">
						<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
					</button>
					<button type="button" data-task-action="delete" data-task-id="${t.id}" class="hidden group-hover:flex items-center justify-center w-6 h-6 rounded text-zinc-400 hover:text-rose-500 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-rose-500" aria-label="Delete task" title="Delete">
						<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
					</button>
				`;
			} else if (isCompleted) {
				actions = `
					<button type="button" data-task-action="restart" data-task-id="${t.id}" class="hidden group-hover:flex items-center justify-center w-6 h-6 rounded text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-500" aria-label="Restart task" title="Restart">
						<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
					</button>
					<button type="button" data-task-action="delete" data-task-id="${t.id}" class="hidden group-hover:flex items-center justify-center w-6 h-6 rounded text-zinc-400 hover:text-rose-500 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-rose-500" aria-label="Delete task" title="Delete">
						<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
					</button>
				`;
			}

			const durationStr = isCompleted ? formatTaskTime(t.elapsedMs) : '';

			// Basic HTML escaping for task text
			const escapedText = t.text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

			return `
				<div class="${rowClass}">
					<div class="flex items-center gap-2 overflow-hidden">
						<span class="w-2 h-2 rounded-full shrink-0 ${indicatorColor}" aria-hidden="true"></span>
						<span class="truncate ${isCompleted ? 'line-through' : ''}">${escapedText}</span>
					</div>
					<div class="flex items-center gap-1 shrink-0 ml-2">
						${durationStr ? `<span class="text-xs font-mono opacity-60 mr-1">${durationStr}</span>` : ''}
						${actions}
					</div>
				</div>
			`;
		}).join('');
	}

	function updateCurrentTasks(state: any) {
		if (!currentTaskContainer) return;
		
		if (state.tasks.length > 0 && state.tasks.every((t: any) => t.status === 'completed')) {
			currentTaskContainer.innerHTML = `
				<div class="text-sm font-medium text-emerald-600 dark:text-emerald-500 text-left py-1">
					✓ All tasks completed
				</div>
			`;
			return;
		}

		const currentTasks = state.tasks.filter((t: any) => t.status === 'current');
		if (currentTasks.length === 0) {
			currentTaskContainer.innerHTML = '';
			return;
		}

		const currentTaskIds = currentTasks.map((t: any) => t.id).join(',');
		const existingIds = currentTaskContainer.getAttribute('data-task-ids');
		
		if (currentTaskIds !== existingIds) {
			currentTaskContainer.setAttribute('data-task-ids', currentTaskIds);
			currentTaskContainer.innerHTML = currentTasks.map((t: any) => {
				const escapedText = t.text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
				return `
				<div class="group flex items-center justify-between py-1.5 px-3 rounded-lg bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 w-full max-w-sm text-sm shadow-sm transition-all motion-reduce:transition-none">
					<div class="flex items-center gap-2 overflow-hidden">
						<span class="w-2 h-2 rounded-full shrink-0 bg-amber-400 ${t.startTime ? 'animate-pulse motion-reduce:animate-none' : ''}" aria-hidden="true"></span>
						<span class="truncate text-zinc-900 dark:text-zinc-100 font-medium">${escapedText}</span>
					</div>
					<div class="flex items-center gap-3 shrink-0 ml-3">
						<span id="current-time-${t.id}" class="text-xs font-mono text-zinc-600 dark:text-zinc-400 tabular-nums"></span>
						<div class="flex items-center gap-1">
							<button type="button" data-task-action="complete" data-task-id="${t.id}" class="w-6 h-6 rounded flex items-center justify-center text-zinc-500 hover:text-emerald-600 dark:hover:text-emerald-500 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500" aria-label="Complete task" title="Complete task">
								<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
							</button>
							<button type="button" data-task-action="return-pending" data-task-id="${t.id}" class="w-6 h-6 rounded flex items-center justify-center text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-500" aria-label="Return to pending" title="Return to pending">
								<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
							</button>
						</div>
					</div>
				</div>
				`;
			}).join('');
		}

		const now = Date.now();
		currentTasks.forEach((t: any) => {
			const el = document.getElementById(`current-time-${t.id}`);
			if (el) {
				const ms = t.startTime ? t.elapsedMs + (now - t.startTime) : t.elapsedMs;
				el.textContent = formatTaskTime(ms);
			}
			
			// Optional: sync pulse state if engine pauses/resumes without changing task id list
			const dot = el?.parentElement?.parentElement?.querySelector('.bg-amber-400');
			if (dot) {
				if (t.startTime) {
					dot.classList.add('animate-pulse', 'motion-reduce:animate-none');
				} else {
					dot.classList.remove('animate-pulse', 'motion-reduce:animate-none');
				}
			}
		});
	}

	let prevTasksRef = store.getState().tasks;
	renderTodoList(prevTasksRef);
	updateCurrentTasks(store.getState());


	// --- Preset UI Logic ---
	const presetChooserContainer = document.getElementById('preset-chooser-container');
	const presetPhaseLabel = document.getElementById('preset-phase-label');

	if (presetChooserContainer) {
		presetChooserContainer.innerHTML = STUDY_PRESETS.map(preset => {
			const totalMins = preset.segments.reduce((acc, s) => acc + s.durationSeconds / 60, 0);
			const segmentsStr = preset.segments.map(s => s.durationSeconds / 60).join(' · ');
			return `
				<button type="button" data-preset-id="${preset.id}" class="w-full text-left p-3 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
					<div class="text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-1">${preset.name}</div>
					<div class="text-xs text-zinc-500 dark:text-zinc-400">${totalMins} min (${segmentsStr})</div>
				</button>
			`;
		}).join('');

		presetChooserContainer.addEventListener('click', (e) => {
			const target = e.target.closest('button[data-preset-id]');
			if (target) {
				const presetId = target.getAttribute('data-preset-id');
				const preset = STUDY_PRESETS.find(p => p.id === presetId);
				if (preset) {
					closeMenu();
					
					store.setState(prev => ({
						...prev,
						mode: 'timer',
						activePresetId: presetId,
						activeSegmentIndex: 0
					}));
					
					timerEngine.setDuration(preset.segments[0].durationSeconds);
					timerEngine.start();
				}
			}
		});
	}

	function updatePresetLabel(state) {
		if (presetPhaseLabel) {
			if (state.mode === 'timer' && state.activePresetId) {
				const preset = STUDY_PRESETS.find(p => p.id === state.activePresetId);
				if (preset && preset.segments[state.activeSegmentIndex]) {
					presetPhaseLabel.textContent = preset.segments[state.activeSegmentIndex].phase;
					presetPhaseLabel.classList.remove('hidden');
				} else {
					presetPhaseLabel.classList.add('hidden');
				}
			} else {
				presetPhaseLabel.classList.add('hidden');
			}
		}
	}


	// 6. Subscriber: DOM Updates
	store.subscribe((state) => {
		if (state.tasks !== prevTasksRef) {
			prevTasksRef = state.tasks;
			renderTodoList(state.tasks);
		}
		updateCurrentTasks(state);
		syncTodoMinimizedState(state);
		updatePresetLabel(state);

		const { mode, style, timer, clock, stopwatch, clockFormat } = state;

		// Clock format buttons
		const selectedClasses = ['bg-zinc-100', 'dark:bg-zinc-700', 'border-zinc-300', 'dark:border-zinc-500', 'text-zinc-900', 'dark:text-zinc-50'];
		const unselectedClasses = ['bg-white', 'dark:bg-zinc-800', 'border-zinc-200', 'dark:border-zinc-700', 'text-zinc-600', 'dark:text-zinc-400'];

		if (btnClock12h) {
			if (clockFormat === '12h') {
				btnClock12h.classList.add(...selectedClasses);
				btnClock12h.classList.remove(...unselectedClasses);
			} else {
				btnClock12h.classList.add(...unselectedClasses);
				btnClock12h.classList.remove(...selectedClasses);
			}
		}

		if (btnClock24h) {
			if (clockFormat === '24h') {
				btnClock24h.classList.add(...selectedClasses);
				btnClock24h.classList.remove(...unselectedClasses);
			} else {
				btnClock24h.classList.add(...unselectedClasses);
				btnClock24h.classList.remove(...selectedClasses);
			}
		}

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

				if (analogAmPmBadge) analogAmPmBadge.classList.add('hidden');

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

				if (analogAmPmBadge) analogAmPmBadge.classList.add('hidden');

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

				if (analogAmPmBadge) {
					if (clock.format === '12h') {
						analogAmPmBadge.textContent = clock.isAm ? 'AM' : 'PM';
						analogAmPmBadge.classList.remove('hidden');
					} else {
						analogAmPmBadge.classList.add('hidden');
					}
				}

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
		store.setState(prev => ({ ...prev, activePresetId: null, activeSegmentIndex: 0 }));
		const raw = timerInput?.value.trim() ?? '';
		if (!raw) {
			const currentInitial = store.getState().timer.initialDurationSeconds;
			// Allow Start if a valid duration is already configured (e.g. via duration route)
			if (shouldStart && currentInitial > 0) {
				setTimerInputError(null);
				timerEngine.start(currentInitial);
				return true;
			}

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
		store.setState(prev => ({ ...prev, activePresetId: null, activeSegmentIndex: 0 }));
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

	// 7. Mode, Style & Size Dropdown Management
	const btnSizeDropdown = document.getElementById('btn-size-dropdown') as HTMLButtonElement | null;
	const sizeDropdownMenu = document.getElementById('size-dropdown-menu');
	const sizeDropdownContainer = document.getElementById('size-dropdown-container');
	const btnExitFull = document.getElementById('btn-exit-full') as HTMLButtonElement | null;


	function closeDropdowns() {
		modeDropdownMenu?.classList.add('hidden');
		btnModeDropdown?.setAttribute('aria-expanded', 'false');
		styleDropdownMenu?.classList.add('hidden');
		btnStyleDropdown?.setAttribute('aria-expanded', 'false');
		sizeDropdownMenu?.classList.add('hidden');
		btnSizeDropdown?.setAttribute('aria-expanded', 'false');
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

	btnSizeDropdown?.addEventListener('click', (e) => {
		e.stopPropagation();
		const isExpanded = btnSizeDropdown.getAttribute('aria-expanded') === 'true';
		closeDropdowns();
		if (!isExpanded && sizeDropdownMenu) {
			sizeDropdownMenu.classList.remove('hidden');
			btnSizeDropdown.setAttribute('aria-expanded', 'true');
		}
	});

	// Mode selection
	document.querySelectorAll('#mode-dropdown-menu [data-mode]').forEach((btn) => {
		btn.addEventListener('click', (e) => {
			e.stopPropagation();
			const newMode = btn.getAttribute('data-mode') as AppMode | null;
			if (newMode) {
				store.setState({ mode: newMode });
				persistState();
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
				persistState();
			}
			closeDropdowns();
			btnStyleDropdown?.focus();
		});
	});

	// Size selection
	document.querySelectorAll('#size-dropdown-menu [data-size]').forEach((btn) => {
		btn.addEventListener('click', (e) => {
			e.stopPropagation();
			const newSize = btn.getAttribute('data-size') as DisplaySize | null;
			if (newSize) {
				if (newSize !== 'full') {
					previousNonFullSize = newSize;
				}
				store.setState({ size: newSize });
				persistState();
			}
			closeDropdowns();
			btnSizeDropdown?.focus();
		});
	});

	btnExitFull?.addEventListener('click', () => {
		store.setState({ size: previousNonFullSize });
		persistState();
	});

	// Close dropdowns on outside click or Escape key
	document.addEventListener('click', (e) => {
		const target = e.target as Node | null;
		if (
			modeDropdownContainer &&
			!modeDropdownContainer.contains(target) &&
			styleDropdownContainer &&
			!styleDropdownContainer.contains(target) &&
			sizeDropdownContainer &&
			!sizeDropdownContainer.contains(target)
		) {
			closeDropdowns();
		}
	});

	document.addEventListener('keydown', (e) => {
		if (e.key === 'Escape') {
			closeDropdowns();
			if (store.getState().size === 'full') {
				store.setState({ size: previousNonFullSize });
			}
		}
	});

	// Handle Size UI updates in subscriber
	store.subscribe((state) => {
		document.body.dataset.size = state.size;

		document.querySelectorAll('#size-dropdown-menu [data-size]').forEach((btn) => {
			const btnSize = btn.getAttribute('data-size');
			const isMatch = btnSize === state.size;
			btn.setAttribute('aria-checked', isMatch ? 'true' : 'false');
			const check = btn.querySelector('.size-check');
			if (check) {
				if (isMatch) check.classList.remove('hidden');
				else check.classList.add('hidden');
			}
		});

		const sizeCap = state.size.charAt(0).toUpperCase() + state.size.slice(1);
		btnSizeDropdown?.setAttribute('aria-label', `Select size, currently ${sizeCap}`);
	});

	// 7.5 Sound Toggle & Keyboard Interactions
	const btnSound = document.getElementById('btn-sound') as HTMLButtonElement | null;
	if (btnSound) {
		btnSound.addEventListener('click', async () => {
			const current = store.getState().soundEnabled;
			store.setState({ soundEnabled: !current });
			persistState();
			await audioSystem.init(); // Initialize audio context on user gesture
		});
	}
	
	// Apply initial sound state UI immediately
	store.subscribe((state) => {
		if (btnSound) {
			if (state.soundEnabled) {
				btnSound.setAttribute('aria-label', 'Sound enabled, click to mute');
				btnSound.title = 'Mute sound';
				btnSound.innerHTML = `<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>`;
			} else {
				btnSound.setAttribute('aria-label', 'Sound muted, click to enable');
				btnSound.title = 'Enable sound';
				btnSound.innerHTML = `<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /><line x1="17" y1="9" x2="23" y2="15" stroke-linecap="round" stroke-linejoin="round" /><line x1="23" y1="9" x2="17" y2="15" stroke-linecap="round" stroke-linejoin="round" /></svg>`;
			}
		}
	});
	// Force initial state update for sound button
	store.setState({});

	// Initialize audio system on user gesture
	document.addEventListener('click', () => {
		audioSystem.init();
	}, { once: true });

	// Keyboard Shortcuts
	document.addEventListener('keydown', (e) => {
		const target = e.target as HTMLElement;
		const isEditable = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT' || target.isContentEditable;
		
		if (e.key === 'Escape') {
			let dropdownOpen = false;
			if (btnModeDropdown?.getAttribute('aria-expanded') === 'true') dropdownOpen = true;
			if (btnStyleDropdown?.getAttribute('aria-expanded') === 'true') dropdownOpen = true;
			if (btnSizeDropdown?.getAttribute('aria-expanded') === 'true') dropdownOpen = true;
			
			if (dropdownOpen) {
				closeDropdowns();
				return;
			}
			
			if (store.getState().size === 'full') {
				store.setState({ size: previousNonFullSize });
				persistState();
			}
			return;
		}

		if (e.key === ' ' && !isEditable) {
			if (target.tagName === 'BUTTON') {
				return;
			}
			
			e.preventDefault();
			const { mode } = store.getState();
			if (mode === 'timer') {
				const status = timerEngine.getStatus();
				if (status === 'running') timerEngine.pause();
				else if (status === 'paused') timerEngine.resume();
				else {
					const ok = handleTimerDurationInput(true);
					if (!ok && timerInput) timerInput.focus();
				}
			} else if (mode === 'stopwatch') {
				const status = stopwatchEngine.getStatus();
				if (status === 'running') stopwatchEngine.pause();
				else if (status === 'paused') stopwatchEngine.resume();
				else stopwatchEngine.start();
			}
		}
	});

	// 8. Initial View State Initialization
	// Force a synchronous render pass using the actual state
	// so the DOM matches the store immediately.
	store.setState(store.getState());

	// Initial size sync (handled by subscriber now, but kept for safety if needed before paint)
	document.body.dataset.size = store.getState().size;

	return {
		store,
		timerEngine,
		stopwatchEngine,
		clockEngine
	};
}
