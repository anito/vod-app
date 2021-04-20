export function post(req, res) {

	const data = req.body;

	// saved in file session
	data.user && (req.session.user = data.user);
	data.groups && (req.session.groups = data.groups);

	res.setHeader('Content-Type', 'application/json');

	res.end(JSON.stringify({
		user: data.user,
		groups: data.groups,
		expires: req.session.cookie.expires
	}));
}