import { settings } from "stores/settingStore";
import { INIT_OPTIONS } from "config";

let expires;
settings.subscribe((val) => {
  const { Session } = { ...INIT_OPTIONS, ...val };
  expires = new Date(new Date().getTime() + parseInt(Session.lifetime));
});

export function get(req, res) {
  res.setHeader("Content-Type", "application/json");
  req.session.cookie.expires = expires;
  res.end(JSON.stringify({ expires }));
}