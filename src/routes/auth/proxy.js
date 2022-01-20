export function post(req, res) {
  const { user, groups } = { ...req.body };
  const expires = req.session.cookie._expires;

  // saved in file session
  req.session.user = user;
  req.session.groups = groups;

  res.setHeader("Content-Type", "application/json");

  res.end(
    JSON.stringify({
      user,
      groups,
      expires,
    })
  );
}
