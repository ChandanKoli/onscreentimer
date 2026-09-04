import test from 'node:test';
import assert from 'node:assert';
import { initWorkspaceController } from '../src/lib/workspace-controller.ts';

// Mocking minimal DOM environment for initWorkspaceController
class MockDOM {
	document: any;
	window: any;
	localStorageData: Record<string, string>;
	elements: Record<string, any>;

	constructor() {
		this.localStorageData = {};
		this.elements = {};

		const createElement = (id: string, overrides: any = {}) => {
			const el = {
				id,
				dataset: {},
				classList: {
					add: () => {},
					remove: () => {},
					toggle: () => false,
				},
				setAttribute: () => {},
				removeAttribute: () => {},
				getAttribute: () => null,
				addEventListener: (evt: string, cb: any) => {
					this.elements[id].listeners = this.elements[id].listeners || {};
					this.elements[id].listeners[evt] = cb;
				},
				focus: () => {},
				listeners: {},
				value: '',
				textContent: '',
				style: {},
				innerHTML: '',
				...overrides
			};
			this.elements[id] = el;
			return el;
		};

		const getElementById = (id: string) => {
			if (this.elements[id]) return this.elements[id];
			return createElement(id);
		};

		// Pre-create required elements
		['display-modern', 'btn-timer-primary', 'btn-timer-reset', 'btn-timer-stop', 'timer-input', 'timer-form', 'timer-input-error', 'modern-time-text'].forEach(id => createElement(id));

		this.document = {
			title: 'Title',
			getElementById,
			querySelectorAll: () => [],
			body: {
				dataset: {}
			},
			documentElement: {
				classList: {
					add: () => {},
					remove: () => {}
				}
			},
			addEventListener: () => {}
		};

		this.window = {
			innerWidth: 1024,
			addEventListener: () => {}
		};
	}

	setup() {
		(global as any).document = this.document;
		(global as any).window = this.window;
		(global as any).localStorage = {
			getItem: (k: string) => this.localStorageData[k] || null,
			setItem: (k: string, v: string) => this.localStorageData[k] = v,
			removeItem: (k: string) => delete this.localStorageData[k]
		};
	}

	teardown() {
		delete (global as any).document;
		delete (global as any).window;
		delete (global as any).localStorage;
	}
}

test('Test 1: Fresh homepage -> 00:00 -> no initial 5-minute configured duration', () => {
	const dom = new MockDOM();
	dom.setup();
	initWorkspaceController();
	
	const timeText = dom.elements['modern-time-text'];
	assert.equal(timeText.textContent, '00:00');
	dom.teardown();
});

test('Test 2: Fresh homepage + empty Start -> validation error -> still 00:00', () => {
	const dom = new MockDOM();
	dom.setup();
	initWorkspaceController();
	
	const btnStart = dom.elements['btn-timer-primary'];
	const timerError = dom.elements['timer-input-error'];
	const timeText = dom.elements['modern-time-text'];

	btnStart.listeners['click']();
	
	assert.equal(timerError.textContent, 'Please enter a duration (e.g. 5, 2mins, 02:00, 90s)');
	assert.equal(timeText.textContent, '00:00');
	dom.teardown();
});

test('Test 3: Fresh homepage Reset -> remains 00:00 -> does not become 05:00', () => {
	const dom = new MockDOM();
	dom.setup();
	initWorkspaceController();
	
	const btnReset = dom.elements['btn-timer-reset'];
	const timeText = dom.elements['modern-time-text'];

	btnReset.listeners['click']();
	assert.equal(timeText.textContent, '00:00');
	dom.teardown();
});

test('Test 4: /timer/5-minutes -> 05:00 idle -> Start works', () => {
	const dom = new MockDOM();
	dom.setup();
	initWorkspaceController({ overrideTimerDuration: 300 });
	
	const timeText = dom.elements['modern-time-text'];
	assert.equal(timeText.textContent, '05:00');

	const btnStart = dom.elements['btn-timer-primary'];
	const timerError = dom.elements['timer-input-error'];
	
	btnStart.listeners['click']();
	assert.equal(timerError.textContent, ''); // No error
	dom.teardown();
});

test('Test 5: /timer/10-minutes -> 10:00 idle -> Start works -> Reset returns 10:00', () => {
	const dom = new MockDOM();
	dom.setup();
	initWorkspaceController({ overrideTimerDuration: 600 });
	
	const timeText = dom.elements['modern-time-text'];
	const btnStart = dom.elements['btn-timer-primary'];
	const btnReset = dom.elements['btn-timer-reset'];
	
	btnStart.listeners['click']();
	// simulate a tick or wait? actually timer starts counting, but reset should bring it back immediately
	btnReset.listeners['click']();
	assert.equal(timeText.textContent, '10:00');
	dom.teardown();
});

test('Test 6: /timer/20-minutes -> 20:00 idle -> Reset returns 20:00', () => {
	const dom = new MockDOM();
	dom.setup();
	initWorkspaceController({ overrideTimerDuration: 1200 });
	
	const timeText = dom.elements['modern-time-text'];
	const btnReset = dom.elements['btn-timer-reset'];
	
	btnReset.listeners['click']();
	assert.equal(timeText.textContent, '20:00');
	dom.teardown();
});

test('Test 7: /timer/10-minutes -> Start -> Stop -> 00:00', () => {
	const dom = new MockDOM();
	dom.setup();
	initWorkspaceController({ overrideTimerDuration: 600 });
	
	const timeText = dom.elements['modern-time-text'];
	const btnStart = dom.elements['btn-timer-primary'];
	const btnStop = dom.elements['btn-timer-stop'];
	
	btnStart.listeners['click']();
	btnStop.listeners['click']();
	
	assert.equal(timeText.textContent, '00:00');
	dom.teardown();
});

test('Test 8: /timer/20-minutes -> Start -> Stop -> 00:00', () => {
	const dom = new MockDOM();
	dom.setup();
	initWorkspaceController({ overrideTimerDuration: 1200 });
	
	const timeText = dom.elements['modern-time-text'];
	const btnStart = dom.elements['btn-timer-primary'];
	const btnStop = dom.elements['btn-timer-stop'];
	
	btnStart.listeners['click']();
	btnStop.listeners['click']();
	
	assert.equal(timeText.textContent, '00:00');
	dom.teardown();
});

test('Test 9: /timer/10-minutes -> manually enter 20mins -> Start -> Reset -> 20:00 -> Stop -> 00:00', () => {
	const dom = new MockDOM();
	dom.setup();
	initWorkspaceController({ overrideTimerDuration: 600 });
	
	const timerInput = dom.elements['timer-input'];
	const btnStart = dom.elements['btn-timer-primary'];
	const btnReset = dom.elements['btn-timer-reset'];
	const btnStop = dom.elements['btn-timer-stop'];
	const timeText = dom.elements['modern-time-text'];

	timerInput.value = '20mins';
	btnStart.listeners['click']();
	
	btnReset.listeners['click']();
	assert.equal(timeText.textContent, '20:00');
	
	btnStop.listeners['click']();
	assert.equal(timeText.textContent, '00:00');
	
	dom.teardown();
});

test('Test 10: Visit idle duration route -> init normal homepage -> homepage must not inherit duration', () => {
	const dom = new MockDOM();
	dom.setup();
	
	// Visit duration route
	initWorkspaceController({ overrideTimerDuration: 600 });
	
	// Simulate navigation by re-initializing without override, simulating page reload
	// The DOM state persists in our Mock, but initWorkspaceController will re-run
	initWorkspaceController();
	
	const timeText = dom.elements['modern-time-text'];
	assert.equal(timeText.textContent, '00:00');
	
	dom.teardown();
});
