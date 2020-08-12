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
			name: 'physio.sid',
			secret: 'SomeSecretStringThatIsNotInGithub',
			resave: false,
			saveUninitialized: true,
			cookie: {
				maxAge: 31536000
			},
			store: new FileStore({
				path: `.sessions`
			})
		}),
		sapper.middleware({
			session: req => ({
					user: req.session && req.session.user
			})
		})
	)
	.listen(PORT, err => {
		if (err) console.log('error', err);
	});
