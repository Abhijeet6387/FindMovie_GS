const middlewares = {
  // Middleware to check the presence and non-emptiness of specified properties in the request body
  CheckCred: (values) => {
    return async (req, res, next) => {
      try {
        for (let val of values) {
          // Check if the property exists in the request body and is not empty
          if (!req.body.hasOwnProperty(val) || req.body[val] == "") {
            next({
              status: 400,
              error: `Property '${val}' does not exist or is empty in the request body`,
            });
            return;
          }
        }
        // Continue to the next middleware if all properties are valid
        next();
      } catch (error) {
        console.error(error);
        next({
          status: 500,
          error: `Internal server error`,
        });
      }
    };
  },

  // Middleware to validate the format and length of a username
  ValidateUserName: async (req, res, next) => {
    try {
      let username = String(req.body.username).trim();
      const len = username.length;

      // Check the length of the username
      if (len < 3 || len > 32) {
        next({
          status: 400,
          error: `Length of username must be between 3 to 32 characters`,
        });
        return;
      }

      // Regular expression to validate the username format (alphanumeric characters, underscores, and hyphens)
      const rxp = new RegExp("^[0-9A-Za-z_-]+$");

      // Check if the username format is valid
      if (!rxp.test(username)) {
        next({
          status: 400,
          error: `Username can only consist of alphanumeric characters, underscores, and hyphens`,
        });
        return;
      }

      // Continue to the next middleware if the username is valid
      next();
    } catch (error) {
      console.error(error);
      next({
        status: 500,
        error: `Internal server error`,
      });
    }
  },
};

export default middlewares;
