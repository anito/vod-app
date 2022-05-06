import { settings } from "stores";
import { INIT_OPTIONS } from "config";

let lifetime;
settings.subscribe((val) => {
  const { Session } = { ...INIT_OPTIONS, ...val };
  lifetime = Session.lifetime;
});

export function post(req, res) {
  const { user, groups } = { ...req.body };
  const expires = new Date(Date.now() + parseInt(lifetime));

  // saved in file session
  req.session.user = user;
  req.session.groups = groups;
  req.session.expires = expires;

  res.setHeader("Content-Type", "application/json");

  res.end(
    JSON.stringify({
      user,
      groups,
      expires,
    })
  );
}
