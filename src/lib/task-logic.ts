import type { AppState, TimerStatus, StopwatchStatus } from './types';

export function engineStatusReducer(
	prev: AppState,
	engine: 'timer' | 'stopwatch',
	status: TimerStatus | StopwatchStatus,
	now: number
): Partial<AppState> {
	let nextActive = prev.activeSessionEngine;
	let nextTasks = prev.tasks;

	if (status === 'running') {
		if (!nextActive) {
			nextActive = engine;
		}
		if (nextActive === engine) {
			const currentCount = nextTasks.filter(t => t.status === 'current').length;
			if (currentCount === 0) {
				const firstPending = nextTasks.find(t => t.status === 'pending');
				if (firstPending) {
					nextTasks = nextTasks.map(t =>
						t.id === firstPending.id ? { ...t, status: 'current', startTime: now } : t
					);
				}
			}
			nextTasks = nextTasks.map(t =>
				t.status === 'current' ? { ...t, startTime: now } : t
			);
		}
	} else {
		if (nextActive === engine) {
			nextTasks = nextTasks.map(t => {
				if (t.status === 'current' && t.startTime !== null) {
					return { ...t, elapsedMs: t.elapsedMs + (now - t.startTime), startTime: null };
				}
				return t;
			});

			if (status === 'completed' || status === 'stopped' || status === 'idle') {
				nextActive = null;
			}
		}
	}

	return { activeSessionEngine: nextActive, tasks: nextTasks };
}

export function taskActionReducer(
	state: AppState,
	action: string,
	taskId: string,
	now: number
): Partial<AppState> {
	let nextTasks = [...state.tasks];

	if (action === 'make-current') {
		const currentCount = nextTasks.filter(t => t.status === 'current').length;
		if (currentCount >= 2) return {};
		const isRunning = state.activeSessionEngine &&
			(state.activeSessionEngine === 'timer' ? state.timer.status === 'running' : state.stopwatch.status === 'running');

		nextTasks = nextTasks.map(t =>
			t.id === taskId ? { ...t, status: 'current', startTime: isRunning ? now : null } : t
		);
	} else if (action === 'return-pending' || action === 'restart') {
		nextTasks = nextTasks.map(t => {
			if (t.id === taskId) {
				const elapsedMs = t.startTime !== null ? t.elapsedMs + (now - t.startTime) : t.elapsedMs;
				return { ...t, status: 'pending', elapsedMs, startTime: null };
			}
			return t;
		});
	} else if (action === 'complete') {
		nextTasks = nextTasks.map(t => {
			if (t.id === taskId) {
				const elapsedMs = t.startTime !== null ? t.elapsedMs + (now - t.startTime) : t.elapsedMs;
				return { ...t, status: 'completed', elapsedMs, startTime: null };
			}
			return t;
		});
	} else if (action === 'delete') {
		nextTasks = nextTasks.filter(t => t.id !== taskId);
	}

	return { tasks: nextTasks };
}
