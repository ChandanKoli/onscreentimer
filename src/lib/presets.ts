import type { SequenceItem, SequencePreset } from './types.ts';

export const STUDY_PRESETS: SequencePreset[] = [
	{
		id: 'preset-1',
		name: 'Learn → Recall → Solve → Review',
		segments: [
			{ durationSeconds: 25 * 60, phase: 'Learn' },
			{ durationSeconds: 5 * 60, phase: 'Recall' },
			{ durationSeconds: 25 * 60, phase: 'Solve' },
			{ durationSeconds: 5 * 60, phase: 'Review' },
		]
	},
	{
		id: 'preset-2',
		name: 'Deep Study → Practice',
		segments: [
			{ durationSeconds: 60 * 60, phase: 'Study' },
			{ durationSeconds: 30 * 60, phase: 'Practice' },
		]
	},
	{
		id: 'preset-3',
		name: 'Learn → Solve',
		segments: [
			{ durationSeconds: 30 * 60, phase: 'Learn' },
			{ durationSeconds: 30 * 60, phase: 'Solve' },
		]
	},
	{
		id: 'preset-4',
		name: 'Study → Solve → Review',
		segments: [
			{ durationSeconds: 45 * 60, phase: 'Study' },
			{ durationSeconds: 45 * 60, phase: 'Solve' },
			{ durationSeconds: 30 * 60, phase: 'Review' },
		]
	}
];

export const COOKING_PRESETS: SequencePreset[] = [
	{
		id: 'cook-preset-1',
		name: 'Perfect Egg',
		segments: [
			{ phase: 'Gooey', durationSeconds: 420, themeColor: 'yellow' },
			{ phase: 'Soft Boil', durationSeconds: 180, themeColor: 'green' },
			{ phase: 'Hard Boil', durationSeconds: 180, themeColor: 'green' },
			{ phase: 'Overcooked', durationSeconds: 120, themeColor: 'red' },
		]
	},
	{
		id: 'cook-preset-2',
		name: 'Instant Noodles',
		segments: [
			{ phase: 'Boil Water', durationSeconds: 120, themeColor: 'yellow' },
			{ phase: 'Cook', durationSeconds: 180, themeColor: 'green' },
		]
	},
	{
		id: 'cook-preset-3',
		name: 'Sweet Corn',
		segments: [
			{ phase: 'Boil Water', durationSeconds: 300, themeColor: 'yellow' },
			{ phase: 'Simmer', durationSeconds: 300, themeColor: 'green' },
		]
	}
];
