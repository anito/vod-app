import { writable } from 'svelte/store';

function createStore() {

    const type = 'success';
    const status = '';
    const message = '';
    const delayed = 1000;
    const { subscribe, update, set } = writable({ type, status, message }, () => { })
    let timeoutId;
    
    return {
        subscribe,
        update: (item) => update(_ => {
            clearTimeout(timeoutId);
            if (!item.keep) {
                timeoutId = setTimeout((_) => set(_), item.delayed || delayed, { message });
            }
            return { type, status, message, ...item };
        }),
        set,
    }

}

export const flash = createStore();