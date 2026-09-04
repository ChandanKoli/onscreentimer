const fs = require('fs');

const path = 'src/lib/persistence.ts';
let content = fs.readFileSync(path, 'utf8');

content = "import { STUDY_PRESETS } from './presets';\n" + content;

const timerHydrationLogic = `		// Timer hydration logic
		let activePresetId = typeof parsed.activePresetId === 'string' ? parsed.activePresetId : null;
		let activeSegmentIndex = typeof parsed.activeSegmentIndex === 'number' ? parsed.activeSegmentIndex : 0;
		
		let timer: PersistedTimer = {
			status: 'idle',
			initialDurationSeconds: 0,
			remainingMs: 0,
			targetEndTime: null
		};
		
		let timerEffectiveEnd = now;

		if (parsed.timer && typeof parsed.timer === 'object') {
			timer.initialDurationSeconds = Math.max(0, Number(parsed.timer.initialDurationSeconds) || 0);
			timer.remainingMs = Math.max(0, Number(parsed.timer.remainingMs) || 0);
			timer.targetEndTime = parsed.timer.targetEndTime ? Number(parsed.timer.targetEndTime) : null;
			timer.status = ['idle', 'running', 'paused', 'completed'].includes(parsed.timer.status) ? parsed.timer.status : 'idle';

			if (timer.status === 'running' && timer.targetEndTime !== null) {
				const diff = timer.targetEndTime - now;
				if (diff <= 0) {
					if (activePresetId) {
						const preset = STUDY_PRESETS.find(p => p.id === activePresetId);
						if (preset) {
							let extraTimeMs = Math.abs(diff);
							let currentIndex = activeSegmentIndex;
							
							while (currentIndex < preset.segments.length - 1) {
								currentIndex++;
								const nextSegDurationMs = preset.segments[currentIndex].durationSeconds * 1000;
								if (extraTimeMs >= nextSegDurationMs) {
									extraTimeMs -= nextSegDurationMs;
								} else {
									// Still running in a later segment
									activeSegmentIndex = currentIndex;
									timer.status = 'running';
									timer.initialDurationSeconds = preset.segments[currentIndex].durationSeconds;
									timer.targetEndTime = now + (nextSegDurationMs - extraTimeMs);
									timer.remainingMs = nextSegDurationMs - extraTimeMs;
									break;
								}
							}
							
							if (currentIndex === preset.segments.length - 1 && extraTimeMs >= preset.segments[currentIndex].durationSeconds * 1000) {
								// Completely finished the preset offline
								activeSegmentIndex = preset.segments.length - 1;
								timer.status = 'completed';
								timer.initialDurationSeconds = preset.segments[currentIndex].durationSeconds;
								timer.targetEndTime = null;
								timer.remainingMs = 0;
								timerEffectiveEnd = Number(parsed.timer.targetEndTime) + (now - Number(parsed.timer.targetEndTime) - extraTimeMs + preset.segments[currentIndex].durationSeconds * 1000); 
								// Wait, effectiveEnd is just originalTargetEndTime + all next segments durations
								let totalAddedMs = 0;
								for (let i = activeSegmentIndex + 1; i < preset.segments.length; i++) {
									totalAddedMs += preset.segments[i].durationSeconds * 1000;
								}
								timerEffectiveEnd = Number(parsed.timer.targetEndTime) + totalAddedMs;
								
								if (activeSessionEngine === 'timer') {
									activeSessionEngine = null;
								}
							}
						}
					} else {
						timerEffectiveEnd = timer.targetEndTime;
						timer.status = 'completed';
						timer.targetEndTime = null;
						timer.remainingMs = 0;
						if (activeSessionEngine === 'timer') {
							activeSessionEngine = null;
						}
					}
				}
			}
		}`;

// We need to replace the existing timer hydration block up to the stopwatch block.
const timerBlockRegex = /\/\/ Timer hydration logic[\s\S]*?(?=\/\/ Stopwatch hydration logic)/;
content = content.replace(timerBlockRegex, timerHydrationLogic + '\n\n\t\t');

// We also need to fix task hydration to use timerEffectiveEnd
const taskHydrationRegex = /const endCap = parsed\.timer\.targetEndTime \? Number\(parsed\.timer\.targetEndTime\) : now;/;
content = content.replace(taskHydrationRegex, 'const endCap = timerEffectiveEnd;');

const returnActivePresetRegex = /activePresetId: typeof parsed\.activePresetId === 'string' \? parsed\.activePresetId : null,\n\s*activeSegmentIndex: typeof parsed\.activeSegmentIndex === 'number' \? parsed\.activeSegmentIndex : 0/;
content = content.replace(returnActivePresetRegex, 'activePresetId,\n\t\t\tactiveSegmentIndex');

fs.writeFileSync(path, content);
console.log('patched');
