import * as api from 'api.js';

export function post(req, res) {

	api.post('users/logout', {}).then(response => {
		
		if (response.success) {
			delete req.session.user;
			delete req.session.role;
		}
		res.setHeader('Content-Type', 'application/json');

		res.end(JSON.stringify(response));
	});

}