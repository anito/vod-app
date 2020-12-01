import * as api from 'api';

export function post(req, res) {
	let user = req.body.user;
	let config = req.body.config;
	config = typeof config === 'array' ? config : !!config ? [ config ] : [];
	
	api.put(`users/${user.id}`, { user }, req.session.user.token).then(response => {
		if (response.success && response.data) {
			config.map(itm => req.session.user[ itm ] = response.data[ itm ]);
		}

		res.setHeader('Content-Type', 'application/json');

		res.end(JSON.stringify(response));
	});
}