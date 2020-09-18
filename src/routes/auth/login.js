import * as api from 'api.js';

export function post(req, res) {
	const user = req.body;

	api.post('users/login', { ...user }).then(response => {

		if (response.success && response.data.user) {
			// what will be saved in file session
			response.data.user && (req.session.user = response.data.user);
			response.data.role && (req.session.role = response.data.role);
		}
		res.setHeader('Content-Type', 'application/json');

		res.end(JSON.stringify(response));
	});
}