import { writable, get } from 'svelte/store';

function createStore() {

    const message = '';
    const type = '';
    const { subscribe, update, set } = writable({type, message}, (  ) => {} )
    
    return {
        subscribe,
        update: (item) => update(text => {
            setTimeout((empty) => set(empty), 8000, {type, message});
            return item;
        }),
    }

}

export const flash = createStore();