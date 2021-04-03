import { writable } from 'svelte/store';
import { __session__ } from 'utils';

function createStore() {

  const { subscribe, update, set } = writable(0, set => {
      
    console.log('first subscriber');
    return () => {
      clearInterval(__session__.interval);
      console.log('%c SESSION ENDED', 'background: #ff5722; color: #ffffff; padding:3px;');
    }
          
  })

  return {
    subscribe,
    init: (exp) => update(() => {
      if (!(exp instanceof Date)) {
        exp = new Date(exp);
      }
      if (__session__.interval) console.log('%c SESSION EXTENDED', 'background: #2f6ef7; color: #ffffff');
      else console.log('%c SESSION STARTED', 'background: #5eba7d; color: #ffffff; padding:3px;');
      
      clearInterval(__session__.interval);
      __session__.interval = setInterval(() => {
        let s = exp - new Date();
        set(s > 0 ? s : 0)
      }, 1000)
    }),
    set,
  }

}

export const ticker = createStore();