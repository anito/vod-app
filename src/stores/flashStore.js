import { writable } from 'svelte/store';

function createStore() {

    const type = '';
    const status = '';
    const message = '';
    const { subscribe, update, set } = writable({ type, status, message }, () => { })
    let timeoutId;
    
    return {
        subscribe,
        update: (item) => update(_ => {
            if (!item.keep) {
                clearTimeout(timeoutId);
                timeoutId = setTimeout((empty) => set(empty), 1000, { type, status, message });
            }
            return { type, status, message, ...item };
        }),
        set,
    }

}

export const flash = createStore();