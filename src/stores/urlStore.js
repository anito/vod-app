import { writable, get } from 'svelte/store';

function createStore() {

    const { subscribe, update, set } = writable( {}, (  ) => {} )
    let items;
    return {
        subscribe,
        add: ( item ) => update( items => !items[item.id] && { ...items, ...item} || items),
        del: (id) => update(items => items[id] && delete items[id] && items || items),
        put: (item) => update(items => items[item.id] && { ...items, ...item } || items),
        set
    }

}

export const urls = createStore();