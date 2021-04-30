import { writable } from 'svelte/store';

function createStore() {
  const { subscribe, update } = writable();

  let previousFab;

  return {
    subscribe,
    update: (val) => update((_) => {
      return (previousFab = _, val)
    }),
    restore: () => update(_ => previousFab),
  };
}
export const fabs = createStore();