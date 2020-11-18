import { writable } from 'svelte/store';


function createStore() {
    
    const { subscribe, update, set } = writable({}, (set) => set({}))

    return {
        subscribe,
        update,
        dispatch: (items) => update(old => items),
        set
    }
}

export const videoEmitter = createStore()