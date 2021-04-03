import { config } from 'config';

export function post(req, res) {
	
  res.setHeader('Content-Type', 'application/json');

  req.session.cookie.expires = new Date(Date.now() + config.MAX_AGE);
  res.end(JSON.stringify({ expires: req.session.cookie.expires }));
}