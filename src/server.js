import sirv from 'sirv';
import polka from 'polka';
import compression from 'compression';
import bodyParser from 'body-parser';
import session from 'express-session';
import sessionFileStore from 'session-file-store';
import * as sapper from '@sapper/server';
import { i18nMiddleware } from "./i18n";
import { config } from 'config';

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === 'development';
const FileStore = new sessionFileStore(session);

// ignore "unable to verify the first certificate" error caused by self signed (root) certificate
dev && ( process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0 );

polka() // You can also use Express
  .use(
    bodyParser.json(),
    sirv('static', { dev }),
    compression({ threshold: 0 }),
    session({
      secret: 'kjsdlkf%$267xKLJ§j93489jksdhfuu$&§%$9usij99jj',
      resave: false,
      saveUninitialized: true,
      cookie: {
        maxAge: config.MAX_AGE,
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
    }),
    i18nMiddleware()
  )
  .listen(PORT, (err) => {
    if (err) console.log('error', err);
  });
