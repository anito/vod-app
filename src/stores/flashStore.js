import { writable } from 'svelte/store';

function createStore() {
  const type = 'success';
  const status = '';
  const message = '';
  const wait = 1000;
  const { subscribe, update, set } = writable({}, () => {});
  let timeoutId;

  return {
    subscribe,
    update: (item) =>
      update((_) => {
        clearTimeout(timeoutId);
        item.wait !== -1 && (timeoutId = setTimeout((emptyMsg) => set(emptyMsg), item.wait || wait, { message }));
        return { type, status, message, ...item };
      }),
    set,
  };
}

export const flash = createStore();
