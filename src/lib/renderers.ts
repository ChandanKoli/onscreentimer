/**
 * Pure display rendering helpers for Digital (Segmented SVG) and Analog (SVG Dial) styles.
 */

// 7-segment bitmasks for characters
// Segments order: [a, b, c, d, e, f, g]
// a: top, b: top-right, c: bottom-right, d: bottom, e: bottom-left, f: top-left, g: center
const SEGMENT_MASKS: Record<string, number[]> = {
	'0': [1, 1, 1, 1, 1, 1, 0],
	'1': [0, 1, 1, 0, 0, 0, 0],
	'2': [1, 1, 0, 1, 1, 0, 1],
	'3': [1, 1, 1, 1, 0, 0, 1],
	'4': [0, 1, 1, 0, 0, 1, 1],
	'5': [1, 0, 1, 1, 0, 1, 1],
	'6': [1, 0, 1, 1, 1, 1, 1],
	'7': [1, 1, 1, 0, 0, 0, 0],
	'8': [1, 1, 1, 1, 1, 1, 1],
	'9': [1, 1, 1, 1, 0, 1, 1],
	'A': [1, 1, 1, 0, 1, 1, 1],
	'P': [1, 1, 0, 0, 1, 1, 1],
	'M': [1, 1, 1, 0, 1, 1, 0], // Simplified 7-segment representation
	' ': [0, 0, 0, 0, 0, 0, 0],
	'-': [0, 0, 0, 0, 0, 0, 1]
};

// Segment SVG polygons for digit of width 36, height 64 (bevel thickness 5)
const SEGMENT_POLYGONS = [
	'5,2 31,2 27,7 9,7', // a (top)
	'32,4 34,7 34,30 29,26 29,8', // b (top-right)
	'32,34 34,37 34,60 29,56 29,38', // c (bottom-right)
	'9,57 27,57 31,62 5,62', // d (bottom)
	'2,37 7,34 7,56 2,60', // e (bottom-left)
	'2,7 7,4 7,26 2,30', // f (top-left)
	'6,32 9,29 27,29 30,32 27,35 9,35' // g (center)
];

/**
 * Generates an SVG string for a single 7-segment digit.
 */
function renderSegmentDigit(char: string, xOffset: number, yOffset: number = 0, scale: number = 1): string {
	const mask = SEGMENT_MASKS[char] ?? SEGMENT_MASKS[' '];
	const segmentsSvg = SEGMENT_POLYGONS.map((points, idx) => {
		const isActive = mask[idx] === 1;
		const opacityClass = isActive
			? 'fill-zinc-950 dark:fill-zinc-50 opacity-100'
			: 'fill-zinc-900/10 dark:fill-zinc-100/10 opacity-100';
		return `<polygon points="${points}" class="${opacityClass} transition-opacity duration-150" />`;
	}).join('');

	return `<g transform="translate(${xOffset}, ${yOffset}) scale(${scale})">${segmentsSvg}</g>`;
}

/**
 * Generates an SVG colon separator.
 */
function renderColon(xOffset: number, yOffset: number = 0): string {
	return `
		<g transform="translate(${xOffset}, ${yOffset})" class="fill-zinc-950 dark:fill-zinc-50">
			<rect x="4" y="19" width="5" height="5" rx="1" />
			<rect x="4" y="40" width="5" height="5" rx="1" />
		</g>
	`;
}

/**
 * Renders complete Digital 7-Segment SVG string from formatted text (e.g. "05:00", "01:25:30", "10:30:00 AM").
 */
export function renderDigitalSvg(text: string): string {
	let x = 0;
	const parts: string[] = [];

	// Parse main time characters
	for (let i = 0; i < text.length; i++) {
		const ch = text[i];
		if (ch === ':') {
			parts.push(renderColon(x));
			x += 16;
		} else if (ch >= '0' && ch <= '9') {
			parts.push(renderSegmentDigit(ch, x));
			x += 42;
		} else if (ch === ' ') {
			x += 16;
		}
	}

	// Removed 7-segment AM/PM rendering; now handled via HTML text badge

	const totalWidth = x;
	const totalHeight = 66;

	return `<svg viewBox="0 0 ${totalWidth} ${totalHeight}" class="w-full max-w-full h-auto select-none" fill="currentColor" aria-hidden="true">${parts.join('')}</svg>`;
}

export interface AnalogAngles {
	hourAngle: number;
	minuteAngle: number;
	secondAngle: number;
}

/**
 * Calculates hand angles (0 to 360 degrees) for Clock, Timer, or Stopwatch.
 */
export function calculateClockAngles(hours: number, minutes: number, seconds: number): AnalogAngles {
	const safeHours = hours % 12;
	const secondAngle = (seconds % 60) * 6;
	const minuteAngle = (minutes % 60) * 6 + (seconds / 60) * 6;
	const hourAngle = safeHours * 30 + (minutes / 60) * 30 + (seconds / 3600) * 30;

	return {
		hourAngle: Number.isFinite(hourAngle) ? hourAngle : 0,
		minuteAngle: Number.isFinite(minuteAngle) ? minuteAngle : 0,
		secondAngle: Number.isFinite(secondAngle) ? secondAngle : 0
	};
}

export function calculateDurationAngles(totalSeconds: number): AnalogAngles {
	const clamped = Math.max(0, Math.floor(totalSeconds));
	const seconds = clamped % 60;
	const minutes = Math.floor(clamped / 60) % 60;
	const hours = Math.floor(clamped / 3600) % 12;

	// In SVG/CSS, 0deg points UP at 12 o'clock, and positive degrees advance CLOCKWISE
	const secondAngle = seconds * 6;
	const minuteAngle = minutes * 6 + (seconds / 60) * 6;
	const hourAngle = hours * 30 + (minutes / 60) * 30;

	return {
		hourAngle: Number.isFinite(hourAngle) ? hourAngle : 0,
		minuteAngle: Number.isFinite(minuteAngle) ? minuteAngle : 0,
		secondAngle: Number.isFinite(secondAngle) ? secondAngle : 0
	};
}

/**
 * Calculates Stopwatch hand angles advancing strictly clockwise with increasing elapsed duration.
 */
export function calculateStopwatchAngles(elapsedSeconds: number): AnalogAngles {
	return calculateDurationAngles(elapsedSeconds);
}

/**
 * Generates hour numbers around the dial.
 */
export function generateHourNumerals(): Array<{ num: number; x: number; y: number }> {
	const numerals = [];
	const cx = 150;
	const cy = 150;
	const radius = 106; // radius for hour numerals inside the 300x300 viewBox

	for (let h = 1; h <= 12; h++) {
		const angleRad = ((h * 30) - 90) * (Math.PI / 180);
		const x = Math.round(cx + radius * Math.cos(angleRad));
		const y = Math.round(cy + radius * Math.sin(angleRad));
		numerals.push({ num: h, x, y });
	}

	return numerals;
}

/**
 * Generates 60 tick marks around the dial.
 */
export function generateDialTicks(): Array<{ isHour: boolean; x1: number; y1: number; x2: number; y2: number }> {
	const ticks = [];
	const cx = 150;
	const cy = 150;
	const outerR = 135;

	for (let i = 0; i < 60; i++) {
		const isHour = i % 5 === 0;
		const innerR = isHour ? 124 : 129;
		const angleRad = (i * 6 - 90) * (Math.PI / 180);

		const x1 = Math.round(cx + outerR * Math.cos(angleRad));
		const y1 = Math.round(cy + outerR * Math.sin(angleRad));
		const x2 = Math.round(cx + innerR * Math.cos(angleRad));
		const y2 = Math.round(cy + innerR * Math.sin(angleRad));

		ticks.push({ isHour, x1, y1, x2, y2 });
	}

	return ticks;
}

export function renderAdjustableModernHtml(text: string, isRunning: boolean): string {
	if (text.length !== 5 && text.length !== 8) return text;
	
		const types = text.length === 8 ? ['h1', 'h2', '', 'm1', 'm2', '', 's1', 's2'] : ['m1', 'm2', '', 's1', 's2'];
	const isSixDigit = text.length === 8;
	const textScaleClass = isSixDigit ? 'text-[clamp(2.5rem,8vw,5.5rem)] group-data-[size=tiny]/body:text-[clamp(1.8rem,5vw,3rem)] group-data-[size=big]/body:text-[clamp(3rem,11vw,8rem)] group-data-[size=full]/body:text-[clamp(3.5rem,14vw,11rem)]' : '';
	const btnPad = isSixDigit ? 'p-1 sm:p-2 md:p-4' : 'p-4';
	const svgSize = isSixDigit ? 'w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8' : 'w-6 h-6 sm:w-8 sm:h-8';
	let html = `<span class="flex items-center pointer-events-none ${textScaleClass}">`;
	for (let i = 0; i < text.length; i++) {
		const char = text[i];
		if (char === ':') {
			html += '<span class="flex flex-col items-center justify-center mx-1 pointer-events-none"><span class="leading-none">:</span></span>';
		} else {
			const type = types[i];
			const visibility = isRunning ? 'opacity-0 pointer-events-none' : 'opacity-50 hover:opacity-100 cursor-pointer';
			const upPoly = '18 15 12 9 6 15';
			const downPoly = '6 9 12 15 18 9';
			html += `<span class="flex flex-col items-center pointer-events-none">
				<button type="button" class="adjust-btn relative z-50 pointer-events-auto ${btnPad} bg-transparent outline-none flex items-center justify-center transition-opacity ${visibility}" data-adjust="up" data-digit="${type}" tabindex="-1" aria-hidden="true">
					<svg class="pointer-events-none ${svgSize} text-zinc-800 dark:text-zinc-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="${upPoly}"></polyline></svg>
				</button>
				<span class="leading-none">${char}</span>
				<button type="button" class="adjust-btn relative z-50 pointer-events-auto ${btnPad} bg-transparent outline-none flex items-center justify-center transition-opacity ${visibility}" data-adjust="down" data-digit="${type}" tabindex="-1" aria-hidden="true">
					<svg class="pointer-events-none ${svgSize} text-zinc-800 dark:text-zinc-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="${downPoly}"></polyline></svg>
				</button>
			</span>`;
		}
	}
	html += '</span>';
	return html;
}

export function renderAdjustableDigitalHtml(text: string, isRunning: boolean): string {
	if (text.length !== 5 && text.length !== 8) return renderDigitalSvg(text);
	
		const types = text.length === 8 ? ['h1', 'h2', '', 'm1', 'm2', '', 's1', 's2'] : ['m1', 'm2', '', 's1', 's2'];
	const isSixDigit = text.length === 8;
	const btnPad = isSixDigit ? 'p-1 sm:p-2 md:p-4' : 'p-4';
	const svgSize = isSixDigit ? 'w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8' : 'w-6 h-6 sm:w-8 sm:h-8';
	let html = '<div class="flex items-center justify-center w-full max-w-full pointer-events-none">';
	for (let i = 0; i < text.length; i++) {
		const char = text[i];
		if (char === ':') {
			html += `<div class="flex flex-col items-center justify-center pointer-events-none" style="flex: 16;">
				<div style="width: 100%; height: auto; aspect-ratio: 16/66;">
					<svg viewBox="0 0 16 66" class="w-full h-full select-none" fill="currentColor" aria-hidden="true">${renderColon(0)}</svg>
				</div>
			</div>`;
		} else {
			const type = types[i];
			const visibility = isRunning ? 'opacity-0 pointer-events-none' : 'opacity-50 hover:opacity-100 cursor-pointer';
			const upPoly = '18 15 12 9 6 15';
			const downPoly = '6 9 12 15 18 9';
			html += `<div class="flex flex-col items-center pointer-events-none" style="flex: 42;">
				<button type="button" class="adjust-btn relative z-50 pointer-events-auto ${btnPad} bg-transparent outline-none flex items-center justify-center transition-opacity ${visibility}" data-adjust="up" data-digit="${type}" tabindex="-1" aria-hidden="true">
					<svg class="pointer-events-none ${svgSize} text-zinc-800 dark:text-zinc-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="${upPoly}"></polyline></svg>
				</button>
				<div style="width: 100%; height: auto; aspect-ratio: 42/66;">
					<svg viewBox="0 0 42 66" class="w-full h-full select-none" fill="currentColor" aria-hidden="true">${renderSegmentDigit(char, 0)}</svg>
				</div>
				<button type="button" class="adjust-btn relative z-50 pointer-events-auto ${btnPad} bg-transparent outline-none flex items-center justify-center transition-opacity ${visibility}" data-adjust="down" data-digit="${type}" tabindex="-1" aria-hidden="true">
					<svg class="pointer-events-none ${svgSize} text-zinc-800 dark:text-zinc-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="${downPoly}"></polyline></svg>
				</button>
			</div>`;
		}
	}
	html += '</div>';
	return html;
}
