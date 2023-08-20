import User from "../models/User.js";
import util from "../middlewares/util.js";

// Auth module contains functions for user signup and login
const auth = {
  // Signup function for creating a new user account
  signup: async (req, res, next) => {
    try {
      let username = req.body.username;
      let password = req.body.password;

      // Trim username and password to remove leading/trailing spaces
      username = String(username).trim();
      password = String(password).trim();

      // Check if a user with the same username already exists
      const _user = await User.findOne({ username: username });

      if (_user) {
        // User with the same username already exists, return a conflict error
        next({
          status: 409,
          error: `User already exists with username: ${username}`,
        });
        return;
      }

      // Hash the user's password before storing it in the database
      const hashed_password = await util.HashPassword(password);

      // Create a new user record in the database
      const newuser = await User.create({
        username,
        password: hashed_password,
      });

      // Issue a JSON Web Token (JWT) for the new user
      const jwt = util.IssueJWT(newuser);

      // Return a success response with the user data and token
      res.status(201).json({
        ok: true,
        data: {
          user: Object.assign(
            {},
            {
              username: newuser.username,
              movies_rated: newuser.movies_rated,
              status: newuser.status,
              created_at: newuser.created_at,
            }
          ),
          token: jwt,
        },
      });
      return;
    } catch (error) {
      // Handle internal server errors
      console.error(error);
      next({
        status: 500,
        error: `Internal server error.`,
      });
    }
  },

  // Login function for user authentication
  login: async (req, res, next) => {
    try {
      let username = req.body.username;
      let password = req.body.password;

      // Trim username and password to remove leading/trailing spaces
      username = String(username).trim();
      password = String(password).trim();

      // Find the user in the database by username
      const user = await User.findOne({ username: username });

      if (!user) {
        // User doesn't exist, return an unauthorized error
        next({
          status: 401,
          error: `User doesn't exist, signup`,
        });
        return;
      }

      // Check if the provided password matches the stored hashed password
      const password_matched = await util.MatchPassword(
        password,
        String(user.password)
      );

      if (!password_matched) {
        // Incorrect username/password, return an unauthorized error
        next({
          status: 401,
          error: `Incorrect username/password`,
        });
        return;
      }

      // Issue a JSON Web Token (JWT) for the authenticated user
      const jwt = util.IssueJWT(user);

      // Return a success response with the user data and token
      res.status(200).json({
        ok: true,
        data: {
          user: Object.assign(
            {},
            {
              username: user.username,
              movies_rated: user.movies_rated,
              status: user.status,
              created_at: user.created_at,
            }
          ),
          token: jwt,
        },
      });
    } catch (error) {
      // Handle internal server errors
      console.error(error);
      next({
        status: 500,
        error: `Internal server error`,
      });
    }
  },
};

export default auth;
