import type { TimerStatus } from './types';

export interface TimerEngineOptions {
	initialDurationSeconds?: number;
	onTick?: (remainingSeconds: number, remainingMs: number) => void;
	onStatusChange?: (status: TimerStatus) => void;
	onComplete?: () => void;
	onSessionStop?: () => void;
}

export class TimerEngine {
	private initialDurationSeconds: number;
	private remainingMs: number;
	private targetEndTime: number | null = null;
	private pausedRemainingMs: number | null = null;
	private status: TimerStatus = 'idle';

	private rafId: number | null = null;
	private backupIntervalId: ReturnType<typeof setInterval> | null = null;

	private onTick?: (remainingSeconds: number, remainingMs: number) => void;
	private onStatusChange?: (status: TimerStatus) => void;
	private onComplete?: () => void;
	private onSessionStop?: () => void;

	constructor(options: TimerEngineOptions = {}) {
		this.initialDurationSeconds = Math.max(0, options.initialDurationSeconds ?? 0);
		this.remainingMs = this.initialDurationSeconds * 1000;
		this.onTick = options.onTick;
		this.onStatusChange = options.onStatusChange;
		this.onComplete = options.onComplete;
		this.onSessionStop = options.onSessionStop;

		// Listen to visibility change to handle tab switching/throttling recovery
		if (typeof document !== 'undefined') {
			document.addEventListener('visibilitychange', this.handleVisibilityChange);
		}
	}

	public getStatus(): TimerStatus {
		return this.status;
	}

	public getInitialDurationSeconds(): number {
		return this.initialDurationSeconds;
	}

	public getRemainingSeconds(): number {
		if (this.status === 'completed') {
			return 0;
		}
		return Math.max(0, Math.ceil(this.remainingMs / 1000));
	}

	public getRemainingMs(): number {
		if (this.status === 'running' && this.targetEndTime !== null) {
			return Math.max(0, this.targetEndTime - Date.now());
		}
		return Math.max(0, this.remainingMs);
	}

	public setDuration(seconds: number): void {
		const validSeconds = Math.max(0, Math.floor(seconds));
		this.initialDurationSeconds = validSeconds;

		if (this.status === 'idle' || this.status === 'completed') {
			this.remainingMs = validSeconds * 1000;
			this.status = 'idle';
			this.pausedRemainingMs = null;
			this.targetEndTime = null;
			this.notifyTick();
			this.notifyStatus();
		}
	}

	public start(durationSeconds?: number): void {
		if (typeof durationSeconds === 'number' && durationSeconds > 0) {
			this.initialDurationSeconds = Math.floor(durationSeconds);
			this.remainingMs = this.initialDurationSeconds * 1000;
			this.pausedRemainingMs = null;
		}

		if (this.status === 'paused' && this.pausedRemainingMs !== null) {
			this.resume();
			return;
		}

		if (this.status === 'idle' || this.status === 'completed') {
			if (this.initialDurationSeconds <= 0 && this.remainingMs <= 0) {
				return;
			}
			this.remainingMs = this.initialDurationSeconds * 1000;
		}

		if (this.remainingMs <= 0) {
			return;
		}

		this.targetEndTime = Date.now() + this.remainingMs;
		this.status = 'running';
		this.notifyStatus();
		this.notifyTick();
		this.startTicker();
	}

	public pause(): void {
		if (this.status !== 'running') return;

		this.stopTicker();
		const now = Date.now();
		if (this.targetEndTime !== null) {
			this.pausedRemainingMs = Math.max(0, this.targetEndTime - now);
			this.remainingMs = this.pausedRemainingMs;
		}
		this.status = 'paused';
		this.notifyStatus();
		this.notifyTick();
	}

	public resume(): void {
		if (this.status !== 'paused') return;

		const toResumeMs = this.pausedRemainingMs ?? this.remainingMs;
		if (toResumeMs <= 0) {
			this.complete();
			return;
		}

		this.targetEndTime = Date.now() + toResumeMs;
		this.pausedRemainingMs = null;
		this.status = 'running';
		this.notifyStatus();
		this.notifyTick();
		this.startTicker();
	}

	public reset(): void {
		this.stopTicker();
		this.status = 'idle';
		this.targetEndTime = null;
		this.pausedRemainingMs = null;
		this.remainingMs = this.initialDurationSeconds * 1000;
		this.notifyStatus();
		this.notifyTick();
	}

	public stop(): void {
		this.stopTicker();
		this.status = 'completed';
		this.targetEndTime = null;
		this.pausedRemainingMs = null;
		this.remainingMs = 0;
		this.notifyStatus();
		this.notifyTick();

		// Session stop hook for future task completion
		if (this.onSessionStop) {
			this.onSessionStop();
		}
	}

	private complete(): void {
		this.stopTicker();
		this.status = 'completed';
		this.targetEndTime = null;
		this.pausedRemainingMs = null;
		this.remainingMs = 0;
		this.notifyStatus();
		this.notifyTick();

		if (this.onComplete) {
			this.onComplete();
		}
	}

	private tick = (): void => {
		if (this.status !== 'running' || this.targetEndTime === null) return;

		const now = Date.now();
		const diff = this.targetEndTime - now;

		if (diff <= 0) {
			this.complete();
		} else {
			this.remainingMs = diff;
			this.notifyTick();
		}
	};

	private handleVisibilityChange = (): void => {
		if (typeof document === 'undefined') return;
		if (!document.hidden && this.status === 'running') {
			this.tick();
		}
	};

	private startTicker(): void {
		this.stopTicker();

		// High frequency update with requestAnimationFrame
		const scheduleRaf = () => {
			if (this.status !== 'running') return;
			this.tick();
			if (typeof requestAnimationFrame !== 'undefined' && this.status === 'running') {
				this.rafId = requestAnimationFrame(scheduleRaf);
			}
		};

		if (typeof requestAnimationFrame !== 'undefined') {
			this.rafId = requestAnimationFrame(scheduleRaf);
		}

		// Fallback interval for background tab execution (since rAF pauses in background)
		if (typeof setInterval !== 'undefined') {
			const interval = setInterval(() => {
				this.tick();
			}, 250);
			if (typeof (interval as any)?.unref === 'function') {
				(interval as any).unref();
			}
			this.backupIntervalId = interval;
		}
	}

	private stopTicker(): void {
		if (this.rafId !== null && typeof cancelAnimationFrame !== 'undefined') {
			cancelAnimationFrame(this.rafId);
			this.rafId = null;
		}
		if (this.backupIntervalId !== null && typeof clearInterval !== 'undefined') {
			clearInterval(this.backupIntervalId);
			this.backupIntervalId = null;
		}
	}

	private notifyTick(): void {
		if (this.onTick) {
			this.onTick(this.getRemainingSeconds(), this.getRemainingMs());
		}
	}

	private notifyStatus(): void {
		if (this.onStatusChange) {
			this.onStatusChange(this.status);
		}
	}

	public getSnapshot(): import('./persistence').PersistedTimer {
		return {
			status: this.status,
			initialDurationSeconds: this.initialDurationSeconds,
			remainingMs: this.pausedRemainingMs !== null ? this.pausedRemainingMs : this.remainingMs,
			targetEndTime: this.targetEndTime,
		};
	}

	public hydrate(data: import('./persistence').PersistedTimer): void {
		this.stopTicker();
		this.initialDurationSeconds = data.initialDurationSeconds;
		this.status = data.status;
		
		if (data.status === 'running' && data.targetEndTime !== null) {
			this.targetEndTime = data.targetEndTime;
			this.remainingMs = Math.max(0, this.targetEndTime - Date.now());
			this.pausedRemainingMs = null;
			this.notifyStatus();
			this.notifyTick();
			this.startTicker();
		} else if (data.status === 'paused') {
			this.targetEndTime = null;
			this.remainingMs = data.remainingMs;
			this.pausedRemainingMs = data.remainingMs;
			this.notifyStatus();
			this.notifyTick();
		} else if (data.status === 'completed') {
			this.targetEndTime = null;
			this.remainingMs = 0;
			this.pausedRemainingMs = null;
			this.notifyStatus();
			this.notifyTick();
		} else {
			// idle
			this.targetEndTime = null;
			this.remainingMs = this.initialDurationSeconds * 1000;
			this.pausedRemainingMs = null;
			this.notifyStatus();
			this.notifyTick();
		}
	}

	public destroy(): void {
		this.stopTicker();
		if (typeof document !== 'undefined') {
			document.removeEventListener('visibilitychange', this.handleVisibilityChange);
		}
	}
}
