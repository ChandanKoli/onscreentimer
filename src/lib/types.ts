export type AppMode = 'timer' | 'clock' | 'stopwatch';
export type DisplayStyle = 'modern' | 'digital' | 'analog';
export type DisplaySize = 'tiny' | 'mid' | 'big' | 'full';

export type TimerStatus = 'idle' | 'running' | 'paused' | 'completed';

export interface TimerState {
	status: TimerStatus;
	initialDurationSeconds: number;
	remainingSeconds: number;
	remainingMs: number;
	rawInput: string;
	inputError: string | null;
}

export type StopwatchStatus = 'idle' | 'running' | 'paused' | 'stopped';

export interface StopwatchState {
	status: StopwatchStatus;
	elapsedSeconds: number;
	elapsedMs: number;
}

export type ClockFormat = '12h' | '24h';

export interface ClockState {
	format: ClockFormat;
	hours: number;
	minutes: number;
	seconds: number;
	isAm: boolean;
	formatted: string;
}

export interface AppState {
	mode: AppMode;
	style: DisplayStyle;
	size: DisplaySize;
	soundEnabled: boolean;
	timer: TimerState;
	clock: ClockState;
	stopwatch: StopwatchState;
}

export type StateListener<T> = (state: T, prevState: T) => void;
export type Unsubscribe = () => void;
