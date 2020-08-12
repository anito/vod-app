import { writable } from 'svelte/store';

function createStore() {

    const { subscribe, update, set, get } = writable( [], (  ) => {} )
    let find = ( id, items ) => {
        return items.findIndex( itm => itm.id == id )
    }
    return {
        subscribe,
        add: ( val ) => update( items => {
            return find( val.id, items ) == -1 && [ ...items, val ] || items;
        }),
        del: ( id ) => update( items => items.filter( ( cur ) => cur.id !== id ) ),
        put: ( id ) => update( items => {
            const index = find( id, items )
            return [...items.slice(0, index), { ...items[index], ...item }, ...items.slice(index + 1)]
        } ),
        update: ( val ) => update( () => val ),
        set
    }

}

export const urls = createStore();