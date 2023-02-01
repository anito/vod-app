import * as api from "api";

export function post(req, res) {
  const { email, password } = { ...req.body };
  const { expires } = { ...req.session.cookie };

  console.log({ ...req.session });
  api.post(`users/login${req.search}`, { email, password }).then((response) => {

    if (response.success) {
      const { user, groups } = { ...response.data };
      const isAdmin = user.group.name === "Administrator";

      // save in file session

      /**
       * NOTE: The user object returned from the Apache Server will be passed
       * to node and may not exceed a certain payload in order to avoid errors.
       * This can be achieved by populating the user with only the minimal necessary assotiations,
       * e.g. Groups, Avatar, Token, Videos
       */
      req.session.user = user;
      isAdmin && (req.session.groups = groups);
    }
    res.setHeader("Content-Type", "application/json");

    // add cookie expiration time for display in session ticker
    res.end(JSON.stringify({ ...response, expires }));
  });
}
