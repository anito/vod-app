import { writable } from 'svelte/store';

function createStore() {

    const type = 'success';
    const status = '';
    const message = '';
    const keep = false;
    const delayed = 1000;
    const { subscribe, update, set } = writable({ type, status, message, delayed, keep }, () => { })
    let timeoutId, timeoutId_2;
    
    return {
        subscribe,
        update: (item) => update(_ => {
            if (!item.keep) {
                clearTimeout(timeoutId);
                timeoutId = setTimeout((_) => set(_), item.delayed || delayed, { type, status, message, delayed, keep });
            }
            return { type, status, message, ...item };
        }),
        set,
    }

}

export const flash = createStore();