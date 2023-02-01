import sirv from 'sirv';
import polka from 'polka';
import compression from 'compression';
import bodyParser from 'body-parser';
import session from 'express-session';
import sessionFileStore from 'session-file-store';
import * as sapper from '@sapper/server';
import { i18nMiddleware } from './i18n';
import { INIT_OPTIONS } from 'config';
import { config } from 'dotenv';

config();
const { PORT, NODE_ENV, API_URI, API_URI_DEV, CLIENT_ID } = process.env;
console.log(process.env);
const dev = NODE_ENV === 'development';
const FileStore = new sessionFileStore(session);

// ignore "unable to verify the first certificate" error caused by self signed (root) certificate
dev && (process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0);

export default polka() // You can also use Express
  .use(
    bodyParser.json(),
    sirv('static', { dev }),
    compression({ threshold: 0 }),
    session({
      secret: 'kjsdlkf%$267xKLJ§j93489jksdhfuu$&§%$9usij99jj',
      resave: false,
      saveUninitialized: true,
      cookie: {
        maxAge: INIT_OPTIONS.Session.lifetime
      },
      store: new FileStore({
        path: `.sessions`
      })
    }),
    sapper.middleware({
      session: (req, res) =>
        req.session && {
          user: req.session.user,
          role: req.session.user && req.session.user.group.name,
          groups: req.session.groups || [],
          expires: req.session.cookie.expires,
          CLIENT_ID
        }
    }),
    i18nMiddleware()
  )
  .listen(PORT, (err) => {
    if (err) console.log('error', err);
  });
