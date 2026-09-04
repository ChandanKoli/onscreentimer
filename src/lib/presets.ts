export interface StudySegment {
	durationSeconds: number;
	phase: string;
}

export interface StudyBlockPreset {
	id: string;
	name: string;
	segments: StudySegment[];
}

export const STUDY_PRESETS: StudyBlockPreset[] = [
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
