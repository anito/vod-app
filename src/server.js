import sirv from 'sirv';
import polka from 'polka';
import compression from 'compression';
import bodyParser from 'body-parser';
import session from 'express-session';
import sessionFileStore from 'session-file-store';
import * as sapper from '@sapper/server';
import { i18nMiddleware } from "./i18n";

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === 'development';
const FileStore = new sessionFileStore(session);

// ignore "unable to verify the first certificate" error caused by self signed (root) certificate
dev && ( process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0 );

polka() // You can also use Express
  .use(
		i18nMiddleware(),
    bodyParser.json(),
    sirv('static', { dev }),
		compression({ threshold: 0 }),
    session({
      secret: 'SomeSecretStringThatIsNotInGithub',
      resave: false,
      saveUninitialized: true,
      cookie: {
        // 1h 		1*60*60*1000
        // maxAge: 1*60*60*1000
        maxAge: 15000 * 1000,
      },
      store: new FileStore({
        path: `.sessions`,
      }),
    }),
    sapper.middleware({
      session: (req) =>
        req.session && {
          user: req.session.user,
          role: req.session.user && req.session.user.group.name,
          groups: req.session.groups || [],
          expires: req.session.cookie.expires,
        },
    })
  )
  .listen(PORT, (err) => {
    if (err) console.log('error', err);
  });
