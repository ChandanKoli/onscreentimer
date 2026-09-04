import fs from 'fs';

const path = 'src/lib/workspace-controller.ts';
let content = fs.readFileSync(path, 'utf8');

// Clear preset on Stop
content = content.replace(
  /btnTimerStop\?\.addEventListener\('click', \(\) => {\n\s*setTimerInputError\(null\);\n\s*timerEngine\.stop\(\);\n\s*}\);/,
  `btnTimerStop?.addEventListener('click', () => {
		setTimerInputError(null);
		store.setState(prev => ({ ...prev, activePresetId: null, activeSegmentIndex: 0 }));
		timerEngine.stop();
	});`
);

// Clear preset on manual Timer start/input
const oldHandleTimerInput = `function handleTimerDurationInput(shouldStart: boolean = false) {`;
const newHandleTimerInput = `function handleTimerDurationInput(shouldStart: boolean = false) {
		store.setState(prev => ({ ...prev, activePresetId: null, activeSegmentIndex: 0 }));`;
content = content.replace(oldHandleTimerInput, newHandleTimerInput);

fs.writeFileSync(path, content);
console.log('patched');
