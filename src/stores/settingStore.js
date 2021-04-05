import { writable } from "svelte/store";

function createStore() {

	const { subscribe, update } = writable({});

	return {
		subscribe,
		update: (val) => update(_ => val)
	}
}
export const settings = createStore();