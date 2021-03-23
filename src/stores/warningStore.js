import { derived } from 'svelte/store';
import { users } from './userStore';
import { isExpired } from 'utils';

function createStore() {

  const warnings = new Map();
  const DEFS = [
    {
      type: {
        value: 'expired',
        label: 'Token abgelaufen',
      },
      value: (usr) => usr.expires && isExpired(usr.expires),
    },
    {
      type: {
        value: 'inactive',
        label: 'Benutzer deaktiviert',
      },
      value: (usr) => !usr.active,
    },
    {
      type: {
        value: 'notoken',
        label: 'Kein Token vorhanden',
      },
      value: (usr) => !usr.token,
    },
  ];

  return derived(users, (_users, set) => {
    for (let _user of _users) {
      let res = [];
      for(const def of DEFS) {
        def.value(_user) && res.push(def.type)
      }
      let item = warnings.get(_user.id)
      item &&
        (res.length &&
          (item.warnings = [...res]) ||
          warnings.delete(_user.id)
        ) ||
        (res.length &&
        warnings.set(_user.id, {
          warnings: res
        }))
    }
    set(warnings);
  })
}

export const warnings = createStore();