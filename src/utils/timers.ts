export interface TimerPreset {
	slug: string;
	minutes: number;
	seconds: number;
}

export const PRESET_TIMER_MINUTES = [
	1, 2, 3, 4, 5, 7, 8, 10, 12, 15, 18, 20, 25, 30, 40, 45, 50, 60, 90, 120
] as const;

export const TIMER_PRESETS: TimerPreset[] = PRESET_TIMER_MINUTES.map((minutes) => ({
	slug: minutes === 1 ? '1-minute' : `${minutes}-minutes`,
	minutes,
	seconds: minutes * 60,
}));

export function getTimerStaticPaths() {
	return TIMER_PRESETS.map((preset) => ({
		params: { duration: preset.slug },
		props: { seconds: preset.seconds, minutes: preset.minutes },
	}));
}
