export function post(req, res) {

	const data = req.body;

	// what will be saved in file session
	req.session.user = data.user;
	req.session.groups = data.groups;

	res.setHeader('Content-Type', 'application/json');

	res.end(JSON.stringify(data));
}