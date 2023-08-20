import Movie from "../models/Movie.js";
import User from "../models/User.js";

// Controllers module contains functions for handling movie-related operations
const controllers = {
  // Get the average rating of a movie by its ID
  getAverageRating: async (req, res, next) => {
    try {
      const movie_id = req.params.movie_id;

      // Check if the movie_id is provided
      if (!movie_id) {
        next({
          status: 400,
          error: `Movie ID can't be empty`,
        });
        return;
      }

      // Find the movie in the database by its ID
      const movie = await Movie.findOne({ id: movie_id });

      // Check if the movie exists
      if (!movie) {
        next({
          status: 400,
          error: `Movie does not exist`,
        });
        return;
      }

      const avg_rating = movie.average_rating;

      // Return the average rating of the movie
      res.status(200).json({
        ok: true,
        data: {
          movie_id: movie_id,
          rating: avg_rating,
        },
      });
      return;
    } catch (error) {
      // Handle internal server errors
      console.error(error);
      next({
        status: 500,
        error: `Internal server error`,
      });
    }
  },

  // Get a paginated list of movies
  getAllMovies: async (req, res, next) => {
    try {
      const limit = 20;
      let page = 1;

      // Check if a specific page is requested
      if (req.query.page) {
        page = parseInt(req.query.page);
      }

      // Find movies in the database with pagination
      const movies = await Movie.find({})
        .skip((page - 1) * limit)
        .limit(limit)
        .exec();

      // Create a result array with selected movie data
      const result = [];
      for (let movie of movies) {
        result.push(
          Object.assign(
            {},
            {
              id: movie.id,
              genre_ids: movie.genre_ids,
              title: movie.title,
              overview: movie.overview,
              poster_path: movie.poster_path,
              release_date: movie.release_date,
              rating: movie.average_rating,
            }
          )
        );
      }

      // Return the list of movies
      res.status(200).json({
        ok: true,
        data: {
          movies: result,
        },
      });
    } catch (error) {
      // Handle internal server errors
      console.error(error);
      next({
        status: 500,
        error: "Internal server error",
      });
    }
  },

  // Rate a movie by its ID
  rateMovie: async (req, res, next) => {
    try {
      const movie_id = req.params.movie_id;
      const rating = parseInt(req.params.rating);

      // Check if the rating is within the valid range
      if (rating <= 0 || rating > 5) {
        next({
          status: 400,
          error: `Rating can only be in between 1 to 5`,
        });
        return;
      }

      // Find the movie in the database by its ID
      const movie = await Movie.findOne({ id: movie_id });

      // Check if the movie exists
      if (!movie) {
        next({
          status: 400,
          error: `Movie does not exist`,
        });
        return;
      }

      // Rate the movie for the authenticated user
      await req.user.rate_movie(movie_id, rating);

      // Fetch the updated user data
      const up_user = await User.findOne({ id: req.user.id });

      // Return the list of movies rated by the user
      res.status(200).json({
        ok: true,
        data: {
          movies_rated: req.user.movies_rated,
        },
      });
    } catch (error) {
      // Handle internal server errors
      console.error(error);
      next({
        status: 500,
        error: error.message || `Internal server error`,
      });
    }
  },
};

export default controllers;
