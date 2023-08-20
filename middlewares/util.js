import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/User.js";

const { sign, verify } = jwt;

// Middlewares module contains functions for JWT authentication and password handling
const middlewares = {
  // Issue a JSON Web Token (JWT) for a user
  IssueJWT: (user) => {
    const payload = { id: user.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET || "demo");
    return token;
  },

  // Hash a plain text password using bcrypt
  HashPassword: async (password) => {
    const hashed_pass = await bcrypt.hash(password, 12);
    return hashed_pass;
  },

  // Compare a plain text password with a hashed password using bcrypt
  MatchPassword: async (plain_pass, hashed_pass) => {
    console.log({ plain_pass, hashed_pass });
    const same = await bcrypt.compare(plain_pass, hashed_pass);
    return same;
  },

  // Verify a JWT token from a request header and attach the user object to the request
  VerifyJWT: async (req, res, next) => {
    try {
      const bearer_token = req.get("Authorization");
      if (!bearer_token) {
        next({
          status: 401,
          error: "Unauthorized, provide a token",
        });
        return;
      } else {
        const token = bearer_token.substr("Bearer ".length);
        const payload = jwt.verify(token, process.env.JWT_SECRET || "demo");
        const id = payload.id;
        const user = await User.findOne({ id: id });
        if (!user) {
          next({
            status: 401,
            error: `Unauthorized, invalid token`,
          });
          return;
        } else {
          // Attach the user object to the request for further processing
          req.user = user;
          next();
        }
      }
    } catch (error) {
      console.error(error);
      next({
        status: error.status || 500,
        error: error.error || "Internal server error",
      });
    }
  },
};

export default middlewares;
