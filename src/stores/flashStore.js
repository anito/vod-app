import { writable } from 'svelte/store';

function createStore() {

    const type = '';
    const status = '';
    const message = '';
    const { subscribe, update, set } = writable({ type, status, message }, () => { })
    let timeoutId;
    
    return {
        subscribe,
        update: (item) => update(text => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout((empty) => set(empty), 1000, {type, status, message});
            return { type, status, message, ...item };
        }),
    }

}

export const flash = createStore();