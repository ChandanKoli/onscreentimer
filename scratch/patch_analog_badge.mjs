import fs from 'fs';

const path = 'src/lib/workspace-controller.ts';
let content = fs.readFileSync(path, 'utf8');

// 1. Add element reference
content = content.replace(
	"const analogNumericalReadout = document.getElementById('analog-numerical-readout');",
	"const analogNumericalReadout = document.getElementById('analog-numerical-readout');\n\tconst analogAmPmBadge = document.getElementById('analog-ampm-badge');"
);

// 2. Hide badge in Timer mode
const timerAnalogRegex = /(\/\/ Analog\n\s*if \(style === 'analog'\) {\n\s*const angles = calculateDurationAngles\(timer\.remainingSeconds\);\n\s*setHandRotation\(handHour, angles\.hourAngle\);\n\s*setHandRotation\(handMinute, angles\.minuteAngle\);\n\s*setHandRotation\(handSecondGroup, angles\.secondAngle\);)/;
content = content.replace(timerAnalogRegex, "$1\n\n\t\t\t\tif (analogAmPmBadge) analogAmPmBadge.classList.add('hidden');");

// 3. Hide badge in Stopwatch mode
const stopwatchAnalogRegex = /(\/\/ Analog \(Strictly clockwise with increasing elapsed duration\)\n\s*if \(style === 'analog'\) {\n\s*const angles = calculateStopwatchAngles\(stopwatch\.elapsedSeconds\);\n\s*setHandRotation\(handHour, angles\.hourAngle\);\n\s*setHandRotation\(handMinute, angles\.minuteAngle\);\n\s*setHandRotation\(handSecondGroup, angles\.secondAngle\);)/;
content = content.replace(stopwatchAnalogRegex, "$1\n\n\t\t\t\tif (analogAmPmBadge) analogAmPmBadge.classList.add('hidden');");

// 4. Update badge in Clock mode
const clockAnalogRegex = /(\/\/ Analog \(Clock hands advance clockwise with local time\)\n\s*if \(style === 'analog'\) {\n\s*const angles = calculateClockAngles\(clock\.hours, clock\.minutes, clock\.seconds\);\n\s*setHandRotation\(handHour, angles\.hourAngle\);\n\s*setHandRotation\(handMinute, angles\.minuteAngle\);\n\s*setHandRotation\(handSecondGroup, angles\.secondAngle\);)/;
content = content.replace(clockAnalogRegex, "$1\n\n\t\t\t\tif (analogAmPmBadge) {\n\t\t\t\t\tif (clock.format === '12h') {\n\t\t\t\t\t\tanalogAmPmBadge.textContent = clock.isAm ? 'AM' : 'PM';\n\t\t\t\t\t\tanalogAmPmBadge.classList.remove('hidden');\n\t\t\t\t\t} else {\n\t\t\t\t\t\tanalogAmPmBadge.classList.add('hidden');\n\t\t\t\t\t}\n\t\t\t\t}");

fs.writeFileSync(path, content);
console.log('patched');
