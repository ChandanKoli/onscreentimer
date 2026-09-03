export interface ParseSuccess {
	ok: true;
	seconds: number;
	formatted: string;
}

export interface ParseError {
	ok: false;
	error: string;
}

export type ParseResult = ParseSuccess | ParseError;

const HOUR_UNITS = new Set(['h', 'hr', 'hrs', 'hour', 'hours']);
const MINUTE_UNITS = new Set(['m', 'min', 'mins', 'minute', 'minutes']);
const SECOND_UNITS = new Set(['s', 'sec', 'secs', 'second', 'seconds']);

/**
 * Parses natural duration strings into total seconds.
 * Supported examples:
 * - "2mins", "2 min", "2m"
 * - "02:00", "2:00" (MM:SS)
 * - "01:30:00", "1:30:00" (HH:MM:SS)
 * - "1hr 30mins", "1h 30m", "1 hour 30 minutes"
 * - "90s", "90sec", "90 seconds"
 * - "5" (plain number defaults to minutes)
 */
export function parseDuration(input: string): ParseResult {
	if (!input || typeof input !== 'string') {
		return { ok: false, error: 'Please enter a duration (e.g. 5, 2mins, 02:00, 90s)' };
	}

	const trimmed = input.trim().toLowerCase();
	if (!trimmed) {
		return { ok: false, error: 'Please enter a duration (e.g. 5, 2mins, 02:00, 90s)' };
	}

	// 1. Plain number: treated as minutes according to product specifications
	if (/^\d+$/.test(trimmed)) {
		const minutes = parseInt(trimmed, 10);
		if (minutes <= 0) {
			return { ok: false, error: 'Duration must be greater than 0' };
		}
		if (minutes > 5999) {
			return { ok: false, error: 'Duration cannot exceed 99 hours' };
		}
		const totalSeconds = minutes * 60;
		return { ok: true, seconds: totalSeconds, formatted: formatDuration(totalSeconds) };
	}

	// 2. Colon-separated format: MM:SS or HH:MM:SS
	if (trimmed.includes(':')) {
		// Clean out incidental spaces around colons (e.g. "02 : 00")
		const cleaned = trimmed.replace(/\s*:\s*/g, ':');
		const parts = cleaned.split(':');

		if (parts.length === 2) {
			const [minStr, secStr] = parts;
			if (!/^\d+$/.test(minStr) || !/^\d+$/.test(secStr)) {
				return { ok: false, error: 'Invalid time format. Use MM:SS (e.g. 02:00)' };
			}
			const minutes = parseInt(minStr, 10);
			const seconds = parseInt(secStr, 10);

			if (seconds >= 60) {
				return { ok: false, error: 'Seconds must be between 0 and 59 in MM:SS format' };
			}
			const totalSeconds = minutes * 60 + seconds;
			if (totalSeconds <= 0) {
				return { ok: false, error: 'Duration must be greater than 0' };
			}
			if (totalSeconds > 359999) {
				return { ok: false, error: 'Duration cannot exceed 99 hours' };
			}
			return { ok: true, seconds: totalSeconds, formatted: formatDuration(totalSeconds) };
		}

		if (parts.length === 3) {
			const [hrStr, minStr, secStr] = parts;
			if (!/^\d+$/.test(hrStr) || !/^\d+$/.test(minStr) || !/^\d+$/.test(secStr)) {
				return { ok: false, error: 'Invalid time format. Use HH:MM:SS (e.g. 01:30:00)' };
			}
			const hours = parseInt(hrStr, 10);
			const minutes = parseInt(minStr, 10);
			const seconds = parseInt(secStr, 10);

			if (minutes >= 60 || seconds >= 60) {
				return { ok: false, error: 'Minutes and seconds must be between 0 and 59 in HH:MM:SS format' };
			}
			const totalSeconds = hours * 3600 + minutes * 60 + seconds;
			if (totalSeconds <= 0) {
				return { ok: false, error: 'Duration must be greater than 0' };
			}
			if (totalSeconds > 359999) {
				return { ok: false, error: 'Duration cannot exceed 99 hours' };
			}
			return { ok: true, seconds: totalSeconds, formatted: formatDuration(totalSeconds) };
		}

		return { ok: false, error: 'Invalid colon format. Use MM:SS or HH:MM:SS' };
	}

	// 3. Natural unit token matching: e.g. "1hr 30mins", "2mins", "90s"
	// Check that the string is strictly composed of number-unit pairs
	const tokenRegex = /(\d+)\s*([a-z]+)/g;
	const fullValidationRegex = /^(\s*\d+\s*[a-z]+\s*)+$/i;

	if (!fullValidationRegex.test(trimmed)) {
		return { ok: false, error: 'Invalid duration. Try "5", "2mins", "02:00", or "90s"' };
	}

	let totalHours = 0;
	let totalMinutes = 0;
	let totalSeconds = 0;
	let matchCount = 0;

	let match: RegExpExecArray | null;
	while ((match = tokenRegex.exec(trimmed)) !== null) {
		matchCount++;
		const val = parseInt(match[1], 10);
		const unit = match[2];

		if (HOUR_UNITS.has(unit)) {
			totalHours += val;
		} else if (MINUTE_UNITS.has(unit)) {
			totalMinutes += val;
		} else if (SECOND_UNITS.has(unit)) {
			totalSeconds += val;
		} else {
			return { ok: false, error: `Unrecognized unit "${unit}". Use h, m, or s (e.g. 2mins, 90s)` };
		}
	}

	if (matchCount === 0) {
		return { ok: false, error: 'Invalid duration. Try "5", "2mins", "02:00", or "90s"' };
	}

	const combinedSeconds = totalHours * 3600 + totalMinutes * 60 + totalSeconds;
	if (combinedSeconds <= 0) {
		return { ok: false, error: 'Duration must be greater than 0' };
	}
	if (combinedSeconds > 359999) {
		return { ok: false, error: 'Duration cannot exceed 99 hours' };
	}

	return { ok: true, seconds: combinedSeconds, formatted: formatDuration(combinedSeconds) };
}

/**
 * Formats a duration in seconds to standard tabular time format.
 * - Always clamped to >= 0 (never negative)
 * - Returns "MM:SS" if under 1 hour
 * - Returns "HH:MM:SS" if 1 hour or more
 */
export function formatDuration(totalSeconds: number): string {
	const clamped = Math.max(0, Math.floor(totalSeconds));
	const hours = Math.floor(clamped / 3600);
	const minutes = Math.floor((clamped % 3600) / 60);
	const seconds = clamped % 60;

	const mm = String(minutes).padStart(2, '0');
	const ss = String(seconds).padStart(2, '0');

	if (hours > 0) {
		const hh = String(hours).padStart(2, '0');
		return `${hh}:${mm}:${ss}`;
	}

	return `${mm}:${ss}`;
}
