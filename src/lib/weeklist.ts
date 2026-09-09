import { hydrateState, serializeState, SCHEMA_VERSION } from './persistence';
import type { Task, AppState } from './types';

interface WeeklistTask {
	id: string;
	text: string;
	timerTaskId: string | null;
}

interface WeeklistData {
	currentWeek: WeeklistTask[][]; // 7 days
	nextWeek: WeeklistTask[][]; // 7 days
}

function generateId() {
	return Math.random().toString(36).substring(2, 9);
}

function getTimerState() {
	const raw = localStorage.getItem('ost_state');
	return hydrateState(raw, Date.now());
}

function saveTimerState(state: any) {
	localStorage.setItem('ost_state', serializeState(state));
}

function getWeeklistData(): WeeklistData {
	const raw = localStorage.getItem('ost_weeklist');
	if (raw) {
		try {
			const parsed = JSON.parse(raw);
			if (parsed && Array.isArray(parsed.currentWeek) && Array.isArray(parsed.nextWeek)) {
				return parsed;
			}
		} catch (e) {}
	}
	// Default
	return {
		currentWeek: Array.from({ length: 7 }, () => []),
		nextWeek: Array.from({ length: 7 }, () => [])
	};
}

function saveWeeklistData(data: WeeklistData) {
	localStorage.setItem('ost_weeklist', JSON.stringify(data));
}

export function initWeeklist() {
	let weeklistData = getWeeklistData();

	function render() {
		// Clean stale linkages on render
		cleanStaleLinkages();

		renderWeek('current-week-days', weeklistData.currentWeek, 'currentWeek');
		renderWeek('next-week-days', weeklistData.nextWeek, 'nextWeek');
	}

	
	function formatTaskTime(ms: number) {
		const totalSeconds = Math.floor(ms / 1000);
		const m = Math.floor(totalSeconds / 60);
		const s = totalSeconds % 60;
		if (m >= 60) {
			const h = Math.floor(m / 60);
			const mm = m % 60;
			return `${h}:${String(mm).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
		}
		return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
	}

	function cleanStaleLinkages() {
		let timerState = getTimerState();
			if (!timerState) timerState = { mode: "timer", style: "modern", size: "mid", soundEnabled: false, timer: {status:"idle", initialDurationSeconds: 0, remainingMs: 0, targetEndTime: null}, stopwatch: {status:"idle", accumulatedMs: 0, startTime: null}, tasks: [], activeSessionEngine: null, todoMinimized: false, clockFormat: "24h", activePresetId: null, activeSegmentIndex: 0 };
		const validTimerIds = new Set(timerState?.tasks?.map((t: Task) => t.id) || []);
		
		let changed = false;
		for (const week of [weeklistData.currentWeek, weeklistData.nextWeek]) {
			for (const dayTasks of week) {
				for (const task of dayTasks) {
					if (task.timerTaskId && !validTimerIds.has(task.timerTaskId)) {
						task.timerTaskId = null;
						changed = true;
					}
				}
			}
		}
		if (changed) {
			saveWeeklistData(weeklistData);
		}
	}

	function getDayTranslation(index: number) {
		// Temporary hack to get translation text. The UI renders Day 1..Day 7 via JS, so we'll grab it from UI directly or inject it
		return document.documentElement.lang === 'pt-br' ? `Dia ${index + 1}` : 
			   document.documentElement.lang === 'fr' ? `Jour ${index + 1}` :
			   document.documentElement.lang === 'it' ? `Giorno ${index + 1}` :
			   document.documentElement.lang === 'es' ? `Día ${index + 1}` :
			   document.documentElement.lang === 'de' ? `Tag ${index + 1}` :
			   document.documentElement.lang === 'ja' ? `${index + 1}日目` :
			   document.documentElement.lang === 'ko' ? `${index + 1}일차` :
			   `Day ${index + 1}`;
	}

	
	let toastTimeout = null;
	function showToast() {
		const toast = document.getElementById('weeklist-toast');
		if (!toast) return;
		toast.classList.remove('opacity-0');
		toast.classList.add('opacity-100');
		if (toastTimeout) clearTimeout(toastTimeout);
		toastTimeout = setTimeout(() => {
			toast.classList.remove('opacity-100');
			toast.classList.add('opacity-0');
		}, 2500);
	}

	function renderWeek(containerId: string, weekTasks: WeeklistTask[][], weekKey: 'currentWeek' | 'nextWeek') {
		const container = document.getElementById(containerId);
		if (!container) return;
		container.innerHTML = '';
		
		const tplDay = (document.getElementById('tpl-day') as HTMLTemplateElement).content;
		const tplTask = (document.getElementById('tpl-task') as HTMLTemplateElement).content;

		let timerState = getTimerState();
			if (!timerState) timerState = { mode: "timer", style: "modern", size: "mid", soundEnabled: false, timer: {status:"idle", initialDurationSeconds: 0, remainingMs: 0, targetEndTime: null}, stopwatch: {status:"idle", accumulatedMs: 0, startTime: null}, tasks: [], activeSessionEngine: null, todoMinimized: false, clockFormat: "24h", activePresetId: null, activeSegmentIndex: 0 };
		const timerTasksMap = new Map(timerState?.tasks?.map((t: Task) => [t.id, t]) || []);

		weekTasks.forEach((dayTasks, dayIndex) => {
			const dayEl = tplDay.cloneNode(true) as DocumentFragment;
			const root = dayEl.querySelector('.day-row') as HTMLElement;
			root.dataset.dayIndex = String(dayIndex);
			root.dataset.weekKey = weekKey;
			
			dayEl.querySelector('.day-title')!.textContent = getDayTranslation(dayIndex);
			
			const tasksContainer = dayEl.querySelector('.tasks-container') as HTMLElement;
			
			dayTasks.forEach(task => {
				const taskEl = tplTask.cloneNode(true) as DocumentFragment;
				const taskRoot = taskEl.querySelector('.task-item') as HTMLElement;
				taskRoot.dataset.taskId = task.id;
				
				taskEl.querySelector('.task-text')!.textContent = task.text;
				
				// Status dot
				const dot = taskEl.querySelector('.status-dot') as HTMLElement;
				const btnAction = taskEl.querySelector('.btn-task-action') as HTMLElement;
				const iconSend = taskEl.querySelector('.icon-send') as HTMLElement;
				const iconRedo = taskEl.querySelector('.icon-redo') as HTMLElement;

				let status = 'unsent';
				let elapsedMs = 0;
				let isLinked = false;
				
				if (task.timerTaskId) {
					const tTask = timerTasksMap.get(task.timerTaskId);
					if (tTask) {
						isLinked = true;
						elapsedMs = tTask.startTime ? tTask.elapsedMs + (Date.now() - tTask.startTime) : tTask.elapsedMs;
						if (tTask.status === 'completed') status = 'completed';
						else if (tTask.status === 'current') status = 'current';
						else status = 'pending';
					}
				}
				
				const durationEl = taskEl.querySelector('.task-duration') as HTMLElement;
				if (isLinked && (elapsedMs > 0 || status === 'current')) {
					durationEl.textContent = formatTaskTime(elapsedMs);
					durationEl.classList.remove('hidden');
				} else {
					durationEl.classList.add('hidden');
				}

				if (status === 'unsent' || status === 'pending') {
					dot.classList.add('bg-rose-400');
					iconSend.classList.remove('hidden');
					iconRedo.classList.add('hidden');
					btnAction.setAttribute('aria-label', document.documentElement.lang === 'pt-br' ? 'Enviar' : 'Send'); // Simplified since it's just aria
				} else if (status === 'current') {
					dot.classList.add('bg-amber-400');
					iconSend.classList.remove('hidden');
					iconRedo.classList.add('hidden');
				} else if (status === 'completed') {
					dot.classList.add('bg-emerald-500');
					iconSend.classList.add('hidden');
					iconRedo.classList.remove('hidden');
				}

				btnAction.addEventListener('click', () => handleTaskAction(task, weekKey, dayIndex));
				
				const btnDelete = taskEl.querySelector('.btn-task-delete') as HTMLElement;
				btnDelete.addEventListener('click', () => {
					weeklistData[weekKey][dayIndex] = weeklistData[weekKey][dayIndex].filter(t => t.id !== task.id);
					saveWeeklistData(weeklistData);
					render();
				});

				tasksContainer.appendChild(taskEl);
			});

			const form = dayEl.querySelector('.add-task-form') as HTMLFormElement;
			if (dayTasks.length < 3) {
				form.classList.remove('hidden');
				form.classList.add('flex');
				form.addEventListener('submit', (e) => {
					e.preventDefault();
					const input = form.querySelector('input') as HTMLInputElement;
					const text = input.value.trim();
					if (text) {
						weeklistData[weekKey][dayIndex].push({
							id: generateId(),
							text,
							timerTaskId: null
						});
						saveWeeklistData(weeklistData);
						render();
						// Restore focus
						const container = document.getElementById(weekKey === 'currentWeek' ? 'current-week-days' : 'next-week-days');
						if (container) {
							const row = container.querySelectorAll('.day-row')[dayIndex];
							const updatedForm = row?.querySelector('.add-task-form') as HTMLFormElement;
							if (updatedForm && !updatedForm.classList.contains('hidden')) {
								updatedForm.querySelector('input')?.focus();
							}
						}
					}
				});
			}

			const btnSendDay = dayEl.querySelector('.btn-send-day') as HTMLElement;
			btnSendDay.addEventListener('click', () => {
				let timerState = getTimerState();
			if (!timerState) timerState = { mode: "timer", style: "modern", size: "mid", soundEnabled: false, timer: {status:"idle", initialDurationSeconds: 0, remainingMs: 0, targetEndTime: null}, stopwatch: {status:"idle", accumulatedMs: 0, startTime: null}, tasks: [], activeSessionEngine: null, todoMinimized: false, clockFormat: "24h", activePresetId: null, activeSegmentIndex: 0 };
				
				let changed = false;

				weeklistData[weekKey][dayIndex].forEach(task => {
					if (!task.timerTaskId || !timerState.tasks.find((t: Task) => t.id === task.timerTaskId)) {
						const newTimerTaskId = generateId();
						timerState.tasks.push({
							id: newTimerTaskId,
							text: task.text,
							status: 'pending',
							elapsedMs: 0,
							startTime: null
						});
						task.timerTaskId = newTimerTaskId;
						changed = true;
					}
				});

				if (changed) {
					saveTimerState(timerState);
					saveWeeklistData(weeklistData);
					render();
					showToast();
				}
			});

			container.appendChild(dayEl);
		});
	}

	function handleTaskAction(task: WeeklistTask, weekKey: 'currentWeek' | 'nextWeek', dayIndex: number) {
		let timerState = getTimerState();
			if (!timerState) timerState = { mode: "timer", style: "modern", size: "mid", soundEnabled: false, timer: {status:"idle", initialDurationSeconds: 0, remainingMs: 0, targetEndTime: null}, stopwatch: {status:"idle", accumulatedMs: 0, startTime: null}, tasks: [], activeSessionEngine: null, todoMinimized: false, clockFormat: "24h", activePresetId: null, activeSegmentIndex: 0 };
		

		let linked = task.timerTaskId ? timerState.tasks.find((t: Task) => t.id === task.timerTaskId) : null;

		if (!linked) {
			// Send to Timer
			const newTimerTaskId = generateId();
			timerState.tasks.push({
				id: newTimerTaskId,
				text: task.text,
				status: 'pending',
				elapsedMs: 0,
				startTime: null
			});
			task.timerTaskId = newTimerTaskId;
			saveTimerState(timerState);
			saveWeeklistData(weeklistData);
			showToast();
		} else {
			if (linked.status === 'completed') {
				// Redo logic
				linked.status = 'pending';
				saveTimerState(timerState);
			} else {
				// Idempotent Send - Already active, do nothing
			}
		}
		render();
	}

	document.getElementById('btn-swap-weeks')?.addEventListener('click', () => {
		const temp = weeklistData.currentWeek;
		weeklistData.currentWeek = weeklistData.nextWeek;
		weeklistData.nextWeek = temp;
		saveWeeklistData(weeklistData);
		render();
	});

	// Listen for localstorage changes in other tabs
	window.addEventListener('storage', (e) => {
		if (e.key === 'ost_state' || e.key === 'ost_weeklist') {
			weeklistData = getWeeklistData();
			render();
		}
	});

	render();
}
