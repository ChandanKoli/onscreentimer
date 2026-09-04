import { describe, it } from 'node:test';
import assert from 'node:assert';
import { STUDY_PRESETS } from '../src/lib/presets.ts';

describe('Study Block Presets Engine Logic', () => {
	it('STUDY_PRESETS contains the correctly structured data', () => {
		assert.strictEqual(STUDY_PRESETS.length, 4);
		assert.strictEqual(STUDY_PRESETS[0].name, 'Learn → Recall → Solve → Review');
		assert.strictEqual(STUDY_PRESETS[0].segments.length, 4);
		assert.strictEqual(STUDY_PRESETS[0].segments[0].durationSeconds, 25 * 60);
		assert.strictEqual(STUDY_PRESETS[0].segments[0].phase, 'Learn');
	});
});
