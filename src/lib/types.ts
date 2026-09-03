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

export interface AppState {
	mode: AppMode;
	style: DisplayStyle;
	size: DisplaySize;
	soundEnabled: boolean;
	timer: TimerState;
}

export type StateListener<T> = (state: T, prevState: T) => void;
export type Unsubscribe = () => void;
