import * as api from 'api.js';
import { get } from 'svelte/store';
import { locale } from 'svelte-i18n';

export function post(req, res) {

	api.post(`users/logout?lang=${get(locale)}`, {}).then(response => {
		
		if (response.success) {
			delete req.session.user;
			delete req.session.role;
		}
		res.setHeader('Content-Type', 'application/json');

		res.end(JSON.stringify(response));
	});

}