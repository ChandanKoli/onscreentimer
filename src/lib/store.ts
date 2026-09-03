import type { StateListener, Unsubscribe } from './types';

export interface Store<T> {
	getState: () => T;
	setState: (updater: Partial<T> | ((prev: T) => T)) => void;
	subscribe: (listener: StateListener<T>) => Unsubscribe;
}

export function createStore<T>(initialState: T): Store<T> {
	let state: T = initialState;
	const listeners = new Set<StateListener<T>>();

	return {
		getState: () => state,
		setState: (updater) => {
			const prevState = state;
			const nextPartial = typeof updater === 'function'
				? (updater as (prev: T) => T)(prevState)
				: updater;

			state = { ...prevState, ...nextPartial };

			listeners.forEach((listener) => {
				listener(state, prevState);
			});
		},
		subscribe: (listener) => {
			listeners.add(listener);
			return () => {
				listeners.delete(listener);
			};
		}
	};
}
