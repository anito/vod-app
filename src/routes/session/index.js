import { config } from 'config';

export function get(req, res) {
	
  res.setHeader('Content-Type', 'application/json');
  res.writeHead(200, {
    'Content-Type': 'application/json',
  });

  req.session.cookie.expires = new Date(Date.now() + config.MAX_AGE);
  res.end(JSON.stringify({ expires: req.session.cookie.expires }));
}