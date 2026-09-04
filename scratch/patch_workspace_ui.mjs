import fs from 'fs';

const path = 'src/lib/workspace-controller.ts';
let content = fs.readFileSync(path, 'utf8');

// Render Preset Chooser and Phase Label
const presetLogic = `
	// --- Preset UI Logic ---
	const presetChooserContainer = document.getElementById('preset-chooser-container');
	const presetPhaseLabel = document.getElementById('preset-phase-label');

	if (presetChooserContainer) {
		presetChooserContainer.innerHTML = STUDY_PRESETS.map(preset => {
			const totalMins = preset.segments.reduce((acc, s) => acc + s.durationSeconds / 60, 0);
			const segmentsStr = preset.segments.map(s => s.durationSeconds / 60).join(' · ');
			return \`
				<button type="button" data-preset-id="\${preset.id}" class="w-full text-left p-3 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
					<div class="text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-1">\${preset.name}</div>
					<div class="text-xs text-zinc-500 dark:text-zinc-400">\${totalMins} min (\${segmentsStr})</div>
				</button>
			\`;
		}).join('');

		presetChooserContainer.addEventListener('click', (e) => {
			const target = e.target.closest('button[data-preset-id]');
			if (target) {
				const presetId = target.getAttribute('data-preset-id');
				const preset = STUDY_PRESETS.find(p => p.id === presetId);
				if (preset) {
					closeMenu();
					
					store.setState(prev => ({
						...prev,
						mode: 'timer',
						activePresetId: presetId,
						activeSegmentIndex: 0
					}));
					
					timerEngine.setDuration(preset.segments[0].durationSeconds);
					timerEngine.start();
				}
			}
		});
	}

	function updatePresetLabel(state) {
		if (presetPhaseLabel) {
			if (state.mode === 'timer' && state.activePresetId) {
				const preset = STUDY_PRESETS.find(p => p.id === state.activePresetId);
				if (preset && preset.segments[state.activeSegmentIndex]) {
					presetPhaseLabel.textContent = preset.segments[state.activeSegmentIndex].phase;
					presetPhaseLabel.classList.remove('hidden');
				} else {
					presetPhaseLabel.classList.add('hidden');
				}
			} else {
				presetPhaseLabel.classList.add('hidden');
			}
		}
	}
`;

// Insert preset logic before "6. Subscriber: DOM Updates"
content = content.replace('	// 6. Subscriber: DOM Updates', presetLogic + '\n\n	// 6. Subscriber: DOM Updates');

// Update DOM Updates to call updatePresetLabel
content = content.replace('		updateCurrentTasks(state);\n		syncTodoMinimizedState(state);', '		updateCurrentTasks(state);\n		syncTodoMinimizedState(state);\n		updatePresetLabel(state);');

fs.writeFileSync(path, content);
console.log('patched');
