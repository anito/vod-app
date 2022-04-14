export function post(req, res) {
  const { user, groups, expires } = { ...req.body, expires: new Date(new Date().getTime() + parseInt(req.body.expires.lifetime)) };

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
