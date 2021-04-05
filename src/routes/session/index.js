import { INIT_OPTIONS } from 'config';
import { settings } from '../../stores/settingStore';

let __session;
settings.subscribe(val => {
  let sess = val.Session,
  props = [ 'lifetime' ];

  // convert to milliseconds
  for (let item of props)
    sess && sess[ item ] && (sess[item] *= 1000);
  
  __session = { ...INIT_OPTIONS.Session, ...sess }
})

export function get(req, res) {
  res.setHeader('Content-Type', 'application/json');
  req.session.cookie.expires = new Date(Date.now() + __session.lifetime);
  res.end(JSON.stringify({ expires: req.session.cookie.expires }));
}