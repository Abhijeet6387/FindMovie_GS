import { Router } from "express";
import controllers from "../../controllers/movie.js";
import util from "../../middlewares/util.js";
const router = Router();

// Open route to get the average rating of a movie
router.get("/:movie_id/rating", controllers.getAverageRating);

router.use(util.VerifyJWT); // Verify the token generated

//Protected routes
router.get("/all", controllers.getAllMovies);
router.post("/:movie_id/rate/:rating", controllers.rateMovie);

export default router;
