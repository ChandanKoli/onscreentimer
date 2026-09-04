import fs from 'fs';

const path = 'src/lib/workspace-controller.ts';
let content = fs.readFileSync(path, 'utf8');

// 1. Import STUDY_PRESETS
content = content.replace(
  "import type { AppState, AppMode, DisplayStyle, TimerStatus, StopwatchStatus, Task } from './types';",
  "import type { AppState, AppMode, DisplayStyle, TimerStatus, StopwatchStatus, Task } from './types';\nimport { STUDY_PRESETS } from './presets';"
);

// 2. Modify onComplete hook
const onCompleteOld = `		onComplete: () => {
			modernTimeText?.classList.add('text-blue-600', 'dark:text-blue-400');
			setTimeout(() => {
				modernTimeText?.classList.remove('text-blue-600', 'dark:text-blue-400');
			}, 1500);
			audioSystem.playCompletionSound(!store.getState().soundEnabled);
		}`;

const onCompleteNew = `		onComplete: () => {
			modernTimeText?.classList.add('text-blue-600', 'dark:text-blue-400');
			setTimeout(() => {
				modernTimeText?.classList.remove('text-blue-600', 'dark:text-blue-400');
			}, 1500);
			audioSystem.playCompletionSound(!store.getState().soundEnabled);
			
			// Preset Progression
			const state = store.getState();
			if (state.activePresetId) {
				const preset = STUDY_PRESETS.find(p => p.id === state.activePresetId);
				if (preset && state.activeSegmentIndex < preset.segments.length - 1) {
					// Advance to next segment immediately
					const nextIndex = state.activeSegmentIndex + 1;
					store.setState(prev => ({ ...prev, activeSegmentIndex: nextIndex }));
					timerEngine.setDuration(preset.segments[nextIndex].durationSeconds);
					timerEngine.start();
				}
			}
		}`;

content = content.replace(onCompleteOld, onCompleteNew);

fs.writeFileSync(path, content);
console.log('patched');
