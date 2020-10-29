import sirv from 'sirv';
import polka from 'polka';
import compression from 'compression';
import bodyParser from 'body-parser';
import session from 'express-session';
import sessionFileStore from 'session-file-store';
import * as sapper from '@sapper/server';

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === 'development';

// ignore "unable to verify the first certificate" error caused by self signed (root) certificate
dev && ( process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0 );

const FileStore = new sessionFileStore(session);

polka() // You can also use Express
	.use(
		bodyParser.json(),
		sirv('static', { dev }),
		compression({ threshold: 0 }),
		session({
			secret: 'SomeSecretStringThatIsNotInGithub',
			resave: true,
			saveUninitialized: true,
			cookie: {
				maxAge: 1*60*60*1000 // 31500000 == 8,75h
			},
			store: new FileStore({
				path: `.sessions`
			})
		}),
		sapper.middleware({
			session: req => (
				req.session && {
				user: req.session.user,
				role: req.session.role,
			})
		})
	)
	.listen(PORT, err => {
		if (err) console.log('error', err);
	});
