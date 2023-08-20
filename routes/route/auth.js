import { Router } from "express";
import validators from "../../middlewares/validate.js";
import controllers from "../../controllers/auth.js";
const router = Router();

/*
    For registering new user
    route: /route/auth/signup
    method: POST

*/
/*
    For signing in
    route: /route/auth/login
    method: POST
*/

router.post(
  "/signup",
  validators.CheckCred(["username", "password"]),
  validators.ValidateUserName,
  controllers.signup
);
router.post("/login", validators.CheckCred(["username", "password"]), controllers.login);

export default router;
