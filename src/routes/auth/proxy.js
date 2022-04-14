import { settings } from "stores/settingStore";
import { INIT_OPTIONS } from "config";

let expires;
settings.subscribe((val) => {
  const { Session } = { ...INIT_OPTIONS, ...val };
  expires = new Date(new Date().getTime() + parseInt(Session.lifetime));
});

export function post(req, res) {
  const { user, groups } = { ...req.body };

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
