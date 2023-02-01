import { settings } from "stores";
import { INIT_OPTIONS } from "config";

let lifetime;
settings.subscribe((val) => {
	const { Session } = { ...INIT_OPTIONS, ...val };
	console.log(Session);
	lifetime = Session.lifetime;
});

export function get(req, res) {
	const expires = new Date(Date.now() + parseInt(lifetime) * 60 * 1000);
	req.session.cookie.expires = expires;

	res.setHeader('Content-Type', 'application/json');
	res.end(JSON.stringify({ expires }));
}