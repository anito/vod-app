export function get(req, res) {
	console.log("proxy:req", req);
	console.log("proxy:res", res);
	
	res.setHeader('Content-Type', 'application/json');

	res.end(JSON.stringify({ user: req.session.user || null }));
}