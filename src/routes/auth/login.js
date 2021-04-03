import * as api from 'api';
import { get } from 'svelte/store';
import { locale } from 'svelte-i18n';

export function post(req, res) {
	const user = req.body;

  api.post(`users/login?lang=${ get(locale) }`, { ...user }).then((response) => {
    // file session receives this
    if (response.success && response.data.user) {
      response.data.user && (req.session.user = response.data.user);
      response.data.user.group.name === 'Administrator' && (req.session.groups = response.data.groups);
    }
    res.setHeader('Content-Type', 'application/json');

    // extend response for sapper session store by cookie expiration time for later use with session ticker
    res.end(JSON.stringify({...response, expires: req.session.cookie.expires}));
  });
}