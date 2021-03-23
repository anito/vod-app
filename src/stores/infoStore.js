import { derived } from 'svelte/store';
import { users } from './userStore';
import { isExpired } from 'utils';

function createStore() {

  function hasActiveVideos(usr) {
    let end, active, now = new Date();
    return usr.videos.reduce((cum, cur) => {
      active = (end = cur._joinData.end) && new Date(end) > now;
      return cum || active
    }, false)
  }
  const infos = new Map();
  const DEFS = [
    {
      key: {
        slug: 'hasActiveVideosAccountInactive',
        label: 'Zugriff auf Inhalte blockiert',
        flag: 'warning',
      },
      value: (usr) => hasActiveVideos(usr) &&
        (!usr.token ||
          !usr.active ||
          (usr.expires &&
            isExpired(usr.expires))),
    },
    {
      key: {
        slug: 'expired',
        label: 'Token abgelaufen',
        flag: 'flash',
      },
      value: (usr) => usr.expires && isExpired(usr.expires),
    },
    {
      key: {
        slug: 'inactive',
        label: 'Benutzer deaktiviert',
        flag: 'flash',
      },
      value: (usr) => !usr.active,
    },
    {
      key: {
        slug: 'notoken',
        label: 'Kein Token vorhanden',
        flag: 'flash',
      },
      value: (usr) => !usr.token,
    },
  ];

  return derived(users, (_users, set) => {
    for (let _user of _users) {
      let res = [];
      for(const def of DEFS) {
        def.value(_user) && res.push(def.key)
      }
      let item = infos.get(_user.id)
      item &&
        (res.length &&
          (item.params = [...res]) ||
          infos.delete(_user.id)
        ) ||
        (res.length &&
        infos.set(_user.id, {
          params: res
        }))
    }
    set(infos);
  })
}

export const infos = createStore();