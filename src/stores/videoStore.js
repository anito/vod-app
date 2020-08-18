import { writable } from 'svelte/store';

function createStore() {

    const { subscribe, update, set } = writable( [], () => {} )

    let findIndexById = ( id, items ) => {
        return items.findIndex( itm => itm.id == id )
    }
    let findItemById = ( id, items ) => {
        let idx = items.findIndex(itm => itm.id == id)
        return items[idx] 
    }

    return {
        subscribe,
        add: ( val ) => update( ( items ) => {
            return findIndexById( val.id, items ) == -1 && [ ...items, ...val ] || items;
        } ),
        put: (val) => update(items => {
            const index = findIndexById( val.id, items )
            return [...items.slice(0, index), { ...items[index], ...val }, ...items.slice(index + 1)]
        } ),
        del: ( id ) => update(items => items.filter( ( itm ) => itm.id !== id )),
        update: (val) => update(items => val),
        set
    }

}

export const videos = createStore();