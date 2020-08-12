import * as api from 'api.js';

export function post(req, res) {
	const user = req.body;

	api.post('users/login', { ...user }).then(response => {

		if (response.success && response.data.user) {
			req.session.user = response.data.user;
		}
		res.setHeader('Content-Type', 'application/json');

		res.end(JSON.stringify(response));
	});
}