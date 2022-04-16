import { settings } from "stores/settingStore";
import { INIT_OPTIONS } from "config";

let lifetime;
settings.subscribe((val) => {
  const { Session } = { ...INIT_OPTIONS, ...val };
  lifetime = Session.lifetime;
});

export function get(req, res) {
  const expires = new Date(Date.now() + parseInt(lifetime));

  res.setHeader("Content-Type", "application/json");
  req.session.cookie.expires = expires;
  res.end(JSON.stringify({ expires }));
}