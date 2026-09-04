import fs from 'fs';

const path = 'src/lib/workspace-controller.ts';
let content = fs.readFileSync(path, 'utf8');

const oldComplete = `			if (state.activePresetId) {
				const preset = STUDY_PRESETS.find(p => p.id === state.activePresetId);
				if (preset && state.activeSegmentIndex < preset.segments.length - 1) {
					// Advance to next segment immediately
					const nextIndex = state.activeSegmentIndex + 1;
					store.setState(prev => ({ ...prev, activeSegmentIndex: nextIndex }));
					timerEngine.setDuration(preset.segments[nextIndex].durationSeconds);
					timerEngine.start();
				}
			}`;

const newComplete = `			if (state.activePresetId) {
				const preset = STUDY_PRESETS.find(p => p.id === state.activePresetId);
				if (preset && state.activeSegmentIndex < preset.segments.length - 1) {
					// Advance to next segment immediately
					const nextIndex = state.activeSegmentIndex + 1;
					store.setState(prev => ({ ...prev, activeSegmentIndex: nextIndex }));
					timerEngine.setDuration(preset.segments[nextIndex].durationSeconds);
					timerEngine.start();
				} else if (preset && state.activeSegmentIndex === preset.segments.length - 1) {
					// Final segment reached zero
					store.setState(prev => ({ ...prev, activePresetId: null, activeSegmentIndex: 0 }));
					const presetPhaseLabel = document.getElementById('preset-phase-label');
					if (presetPhaseLabel) {
						presetPhaseLabel.textContent = 'Block complete';
						presetPhaseLabel.classList.remove('hidden');
						setTimeout(() => {
							updatePresetLabel(store.getState());
						}, 3000);
					}
				}
			}`;

content = content.replace(oldComplete, newComplete);

fs.writeFileSync(path, content);
console.log('patched');
