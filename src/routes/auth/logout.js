import * as api from "api.js";

export async function post(req, res) {
  const token = req.session.user?.jwt;
  const locale = req.query.locale;
  await api
    .post(`users/logout?token=${token}&locale=${locale}`, {})
    .then((response) => {
      if (response.success) {
        delete req.session.user;
        delete req.session.role;
        delete req.session.groups;
      }
      res.setHeader("Content-Type", "application/json");

      res.end(JSON.stringify(response));
    });
}
