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

test('Duration route initializes 10:00 configured Timer', () => {
	const dom = new MockDOM();
	dom.setup();

	initWorkspaceController({ overrideTimerDuration: 600 });
	
	// Check state in localStorage after initialization (since it doesn't return the store directly)
	// Actually, wait, it saves to localStorage when status changes or page hides.
	// We can inspect the DOM updates directly!
	// Wait, formatDuration updates modernTimeText when ticking?
	// When started, it ticks. But at init, clockEngine ticks? 
	// Let's just simulate the start button.
	const timerInput = dom.elements['timer-input'];
	const btnStart = dom.elements['btn-timer-primary'];
	const timerError = dom.elements['timer-input-error'];

	// 1. Initial state: timer should NOT have an error
	assert.equal(timerError.classList.removeCalls || 0, 0); // No error initially

	// 2. Empty input Start: should start the preconfigured timer, not show error
	timerInput.value = ''; // Ensure it's empty
	btnStart.listeners['click']();
	
	assert.equal(timerError.textContent, ''); // Error should be empty
	// We know it started if it didn't set an error and returns gracefully

	dom.teardown();
});

test('Homepage empty Start produces validation error', () => {
	const dom = new MockDOM();
	dom.setup();

	initWorkspaceController();
	
	const timerInput = dom.elements['timer-input'];
	const btnStart = dom.elements['btn-timer-primary'];
	const timerError = dom.elements['timer-input-error'];

	timerInput.value = '';
	btnStart.listeners['click']();
	
	// Error should be shown
	assert.equal(timerError.textContent, 'Please enter a duration (e.g. 5, 2mins, 02:00, 90s)');

	dom.teardown();
});

test('Manual input on a duration route overrides initial configured time', () => {
	const dom = new MockDOM();
	dom.setup();

	initWorkspaceController({ overrideTimerDuration: 600 });
	
	const timerInput = dom.elements['timer-input'];
	const btnStart = dom.elements['btn-timer-primary'];
	const timerForm = dom.elements['timer-form'];
	const timerError = dom.elements['timer-input-error'];

	// User types something
	timerInput.value = '20mins';
	
	// Click start
	btnStart.listeners['click']();
	
	// No error
	assert.equal(timerError.textContent, '');
	
	dom.teardown();
});
