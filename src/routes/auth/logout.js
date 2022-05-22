import * as api from 'api.js';

export async function post(req, res) {
  await api.post(`users/logout${req.search}`, {}).then((response) => {
    if (response.success) {
      delete req.session.user;
      delete req.session.role;
      delete req.session.groups;
    }
    res.setHeader('Content-Type', 'application/json');

    res.end(JSON.stringify(response));
  });
}
