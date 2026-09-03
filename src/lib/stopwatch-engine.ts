import type { StopwatchStatus } from './types';

export interface StopwatchEngineOptions {
	onTick?: (elapsedSeconds: number, elapsedMs: number) => void;
	onStatusChange?: (status: StopwatchStatus) => void;
}

export class StopwatchEngine {
	private accumulatedMs: number = 0;
	private startTime: number | null = null;
	private status: StopwatchStatus = 'idle';

	private rafId: number | null = null;
	private backupIntervalId: ReturnType<typeof setInterval> | null = null;

	private onTick?: (elapsedSeconds: number, elapsedMs: number) => void;
	private onStatusChange?: (status: StopwatchStatus) => void;

	constructor(options: StopwatchEngineOptions = {}) {
		this.onTick = options.onTick;
		this.onStatusChange = options.onStatusChange;

		if (typeof document !== 'undefined') {
			document.addEventListener('visibilitychange', this.handleVisibilityChange);
		}
	}

	public getStatus(): StopwatchStatus {
		return this.status;
	}

	public getElapsedMs(): number {
		if (this.status === 'running' && this.startTime !== null) {
			return this.accumulatedMs + Math.max(0, Date.now() - this.startTime);
		}
		return this.accumulatedMs;
	}

	public getElapsedSeconds(): number {
		return Math.floor(this.getElapsedMs() / 1000);
	}

	public start(): void {
		if (this.status === 'running') return;

		if (this.status === 'paused') {
			this.resume();
			return;
		}

		// Starting from idle or stopped
		if (this.status === 'stopped') {
			// If stopped, starting fresh resets accumulated time
			this.accumulatedMs = 0;
		}

		this.startTime = Date.now();
		this.status = 'running';
		this.notifyStatus();
		this.notifyTick();
		this.startTicker();
	}

	public pause(): void {
		if (this.status !== 'running' || this.startTime === null) return;

		this.stopTicker();
		this.accumulatedMs += Math.max(0, Date.now() - this.startTime);
		this.startTime = null;
		this.status = 'paused';
		this.notifyStatus();
		this.notifyTick();
	}

	public resume(): void {
		if (this.status !== 'paused') return;

		this.startTime = Date.now();
		this.status = 'running';
		this.notifyStatus();
		this.notifyTick();
		this.startTicker();
	}

	public reset(): void {
		this.stopTicker();
		this.startTime = null;
		this.accumulatedMs = 0;
		this.status = 'idle';
		this.notifyStatus();
		this.notifyTick();
	}

	public stop(): void {
		if (this.status === 'idle' || this.status === 'stopped') return;

		this.stopTicker();
		if (this.status === 'running' && this.startTime !== null) {
			this.accumulatedMs += Math.max(0, Date.now() - this.startTime);
			this.startTime = null;
		}
		// Preserves final accumulated elapsed value without zeroing
		this.status = 'stopped';
		this.notifyStatus();
		this.notifyTick();
	}

	private tick = (): void => {
		if (this.status !== 'running') return;
		this.notifyTick();
	};

	private handleVisibilityChange = (): void => {
		if (typeof document === 'undefined') return;
		if (!document.hidden && this.status === 'running') {
			this.tick();
		}
	};

	private startTicker(): void {
		this.stopTicker();

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
			this.onTick(this.getElapsedSeconds(), this.getElapsedMs());
		}
	}

	private notifyStatus(): void {
		if (this.onStatusChange) {
			this.onStatusChange(this.status);
		}
	}

	public getSnapshot(): import('./persistence').PersistedStopwatch {
		return {
			status: this.status,
			accumulatedMs: this.accumulatedMs,
			startTime: this.startTime,
		};
	}

	public hydrate(data: import('./persistence').PersistedStopwatch): void {
		this.stopTicker();
		this.status = data.status;
		
		if (data.status === 'running' && data.startTime !== null) {
			this.startTime = data.startTime;
			this.accumulatedMs = data.accumulatedMs;
			this.notifyStatus();
			this.notifyTick();
			this.startTicker();
		} else {
			this.startTime = null;
			this.accumulatedMs = data.accumulatedMs;
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
