import type { ClockFormat, ClockState } from './types';

export interface ClockEngineOptions {
	initialFormat?: ClockFormat;
	onTick?: (state: ClockState) => void;
}

export class ClockEngine {
	private format: ClockFormat = '12h';
	private onTick?: (state: ClockState) => void;

	private rafId: number | null = null;
	private backupIntervalId: ReturnType<typeof setInterval> | null = null;
	private isRunning: boolean = false;

	constructor(options: ClockEngineOptions = {}) {
		this.format = options.initialFormat ?? '12h';
		this.onTick = options.onTick;

		if (typeof document !== 'undefined') {
			document.addEventListener('visibilitychange', this.handleVisibilityChange);
		}
	}

	public getFormat(): ClockFormat {
		return this.format;
	}

	public setFormat(format: ClockFormat): void {
		this.format = format;
		this.notifyTick();
	}

	public getClockState(): ClockState {
		const now = new Date();
		const rawHours = now.getHours();
		const minutes = now.getMinutes();
		const seconds = now.getSeconds();
		const isAm = rawHours < 12;

		let displayHours: number;
		if (this.format === '12h') {
			displayHours = rawHours % 12;
			if (displayHours === 0) {
				displayHours = 12;
			}
		} else {
			displayHours = rawHours;
		}

		const hh = this.format === '12h'
			? String(displayHours).padStart(2, '0')
			: String(displayHours).padStart(2, '0');
		const mm = String(minutes).padStart(2, '0');
		const ss = String(seconds).padStart(2, '0');

		const formattedTime = `${hh}:${mm}:${ss}`;
		const formatted = this.format === '12h' ? `${formattedTime} ${isAm ? 'AM' : 'PM'}` : formattedTime;

		return {
			format: this.format,
			hours: displayHours,
			minutes,
			seconds,
			isAm,
			formatted
		};
	}

	public start(): void {
		if (this.isRunning) return;
		this.isRunning = true;
		this.notifyTick();
		this.startTicker();
	}

	public stop(): void {
		this.isRunning = false;
		this.stopTicker();
	}

	private tick = (): void => {
		if (!this.isRunning) return;
		this.notifyTick();
	};

	private handleVisibilityChange = (): void => {
		if (typeof document === 'undefined') return;
		if (!document.hidden && this.isRunning) {
			this.tick();
		}
	};

	private startTicker(): void {
		this.stopTicker();

		const scheduleRaf = () => {
			if (!this.isRunning) return;
			this.tick();
			if (typeof requestAnimationFrame !== 'undefined' && this.isRunning) {
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
			this.onTick(this.getClockState());
		}
	}

	public destroy(): void {
		this.stop();
		if (typeof document !== 'undefined') {
			document.removeEventListener('visibilitychange', this.handleVisibilityChange);
		}
	}
}
