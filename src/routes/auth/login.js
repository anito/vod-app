import * as api from "api";

export function post(request, response) {
  const { email, password } = { ...request.body };
  const expires = request.session.cookie.expires;
  const { locale } = request.session;
  const searchParams = new URLSearchParams(request.search);
  if (locale) {
    searchParams.append('locale', locale);
  }

  api.post(`users/login?${searchParams.toString()}`, { email, password }).then((res) => {
    if (res.success) {
      const { user, groups } = { ...res.data };
      const isAdmin = user.group.name === 'Administrator';

      // save in file session

      /**
       * NOTE: The user object returned from the Apache Server will be passed
       * to node and may not exceed a certain payload in order to avoid errors.
       * This can be achieved by populating the user with only the minimal necessary assotiations,
       * e.g. Groups, Avatar, Token, Videos
       */
      request.session.user = user;
      isAdmin && (request.session.groups = groups);
    }
    response.setHeader('Content-Type', 'application/json');

    // add cookie expiration time for display in session ticker
    response.end(JSON.stringify({ ...res, expires }));
  });
}

export function get(request, response) {
  const expires = request.session.cookie.expires;
  const { locale } = request.session;
  const searchParams = new URLSearchParams(request.search);
  if (locale) {
    searchParams.append('locale', locale);
  }

  api.get(`users/login?${searchParams.toString()}`).then((res) => {
    if (res.success) {
      const { user, groups } = res.data;
      request.session.user = user;

      if (user.group.name === 'Administrator') {
        request.session.groups = groups;
      }
    }
    response.setHeader('Content-Type', 'application/json');
    response.end(JSON.stringify({ ...res }));
  });
}
