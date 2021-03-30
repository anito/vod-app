import * as api from 'api.js';
import { get } from 'svelte/store';
import { locale } from 'svelte-i18n';

export function post(req, res) {
	const user = req.body;

	api.post(`users?lang=${get(locale)}`, { user }).then(response => {
		if (response.user) {
			req.session.user = response.user;
		}

		res.setHeader('Content-Type', 'application/json');

		res.end(JSON.stringify(response));
	});
}