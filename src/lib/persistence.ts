import type { AppMode, DisplayStyle, DisplaySize, TimerStatus, StopwatchStatus, Task, ClockFormat } from './types';

export const SCHEMA_VERSION = 1;

export interface PersistedTimer {
	status: TimerStatus;
	initialDurationSeconds: number;
	remainingMs: number;
	targetEndTime: number | null;
}

export interface PersistedStopwatch {
	status: StopwatchStatus;
	accumulatedMs: number;
	startTime: number | null;
}

export interface PersistedState {
	version: number;
	mode: AppMode;
	style: DisplayStyle;
	size: DisplaySize;
	previousNonFullSize?: DisplaySize;
	soundEnabled: boolean;
	timer: PersistedTimer;
	stopwatch: PersistedStopwatch;
	tasks: Task[];
	activeSessionEngine: 'timer' | 'stopwatch' | null;
	todoMinimized: boolean;
	clockFormat: ClockFormat;
}

export function serializeState(state: Omit<PersistedState, 'version'>): string {
	const data: PersistedState = {
		version: SCHEMA_VERSION,
		...state
	};
	return JSON.stringify(data);
}

export function hydrateState(json: string | null, now: number): Omit<PersistedState, 'version'> | null {
	if (!json) return null;
	
	try {
		const parsed = JSON.parse(json);
		if (!parsed || typeof parsed !== 'object' || parsed.version !== SCHEMA_VERSION) {
			return null;
		}

		// Validation and sanitization
		const mode = ['timer', 'clock', 'stopwatch'].includes(parsed.mode) ? parsed.mode : 'timer';
		const style = ['modern', 'digital', 'analog'].includes(parsed.style) ? parsed.style : 'modern';
		const size = ['tiny', 'mid', 'big', 'full'].includes(parsed.size) ? parsed.size : 'mid';
		const previousNonFullSize = ['tiny', 'mid', 'big'].includes(parsed.previousNonFullSize) ? parsed.previousNonFullSize : 'mid';
		const soundEnabled = typeof parsed.soundEnabled === 'boolean' ? parsed.soundEnabled : false;
		const todoMinimized = typeof parsed.todoMinimized === 'boolean' ? parsed.todoMinimized : false;
		const clockFormat = parsed.clockFormat === '12h' || parsed.clockFormat === '24h' ? parsed.clockFormat : '24h';
		
		let activeSessionEngine = ['timer', 'stopwatch'].includes(parsed.activeSessionEngine) ? parsed.activeSessionEngine : null;

		// Timer hydration logic
		let timer: PersistedTimer = {
			status: 'idle',
			initialDurationSeconds: 0,
			remainingMs: 0,
			targetEndTime: null
		};
		
		if (parsed.timer && typeof parsed.timer === 'object') {
			timer.initialDurationSeconds = Math.max(0, Number(parsed.timer.initialDurationSeconds) || 0);
			timer.remainingMs = Math.max(0, Number(parsed.timer.remainingMs) || 0);
			timer.targetEndTime = parsed.timer.targetEndTime ? Number(parsed.timer.targetEndTime) : null;
			timer.status = ['idle', 'running', 'paused', 'completed'].includes(parsed.timer.status) ? parsed.timer.status : 'idle';

			if (timer.status === 'running' && timer.targetEndTime !== null) {
				const diff = timer.targetEndTime - now;
				if (diff <= 0) {
					timer.status = 'completed';
					timer.targetEndTime = null;
					timer.remainingMs = 0;
					// If timer expired, it releases ownership
					if (activeSessionEngine === 'timer') {
						activeSessionEngine = null;
					}
				}
			}
		}

		// Stopwatch hydration logic
		let stopwatch: PersistedStopwatch = {
			status: 'idle',
			accumulatedMs: 0,
			startTime: null
		};
		
		if (parsed.stopwatch && typeof parsed.stopwatch === 'object') {
			stopwatch.accumulatedMs = Math.max(0, Number(parsed.stopwatch.accumulatedMs) || 0);
			stopwatch.startTime = parsed.stopwatch.startTime ? Number(parsed.stopwatch.startTime) : null;
			stopwatch.status = ['idle', 'running', 'paused', 'stopped'].includes(parsed.stopwatch.status) ? parsed.stopwatch.status : 'idle';
		}

		// Task hydration logic
		let tasks: Task[] = [];
		if (Array.isArray(parsed.tasks)) {
			tasks = parsed.tasks.map((t: any) => {
				const id = typeof t.id === 'string' ? t.id : Math.random().toString(36).substring(2, 9);
				const text = typeof t.text === 'string' ? t.text : '';
				const status = ['pending', 'current', 'completed'].includes(t.status) ? t.status : 'pending';
				let elapsedMs = Math.max(0, Number(t.elapsedMs) || 0);
				let startTime = t.startTime !== null && t.startTime !== undefined ? Number(t.startTime) : null;

				// Offline time accounting
				if (status === 'current' && startTime !== null) {
					if (parsed.activeSessionEngine === 'timer') {
						// Previous state had timer running
						// We capped it earlier if timer expired
						const endCap = parsed.timer.targetEndTime ? Number(parsed.timer.targetEndTime) : now;
						const effectiveEnd = Math.min(now, endCap);
						const addedMs = Math.max(0, effectiveEnd - startTime);
						elapsedMs += addedMs;
						
						// If the timer is still running, task remains running (startTime = now)
						// If timer completed, task stays 'current' but no longer running (startTime = null)
						startTime = timer.status === 'running' ? now : null;
					} else if (parsed.activeSessionEngine === 'stopwatch') {
						if (stopwatch.status === 'running') {
							const addedMs = Math.max(0, now - startTime);
							elapsedMs += addedMs;
							startTime = now;
						} else {
							startTime = null; // Should not happen if owner is properly synced, but safe fallback
						}
					} else {
						// No active engine, so it shouldn't have been accumulating
						startTime = null;
					}
				} else if (status === 'current') {
					// It's current but was not running (e.g., paused)
					// Just update startTime based on whether it should resume
					if (parsed.activeSessionEngine === 'timer' && timer.status === 'running') {
						startTime = now;
					} else if (parsed.activeSessionEngine === 'stopwatch' && stopwatch.status === 'running') {
						startTime = now;
					} else {
						startTime = null;
					}
				}

				return { id, text, status, elapsedMs, startTime };
			});
		}

		return {
			mode,
			style,
			size,
			previousNonFullSize,
			soundEnabled,
			timer,
			stopwatch,
			tasks,
			activeSessionEngine,
			todoMinimized,
			clockFormat
		};
	} catch {
		return null; // Fallback safely if JSON is corrupt
	}
}
