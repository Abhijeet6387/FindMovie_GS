import mongoose from "mongoose";
import Movie from "./Movie.js";

// Define a subdocument schema for storing movie ratings
const movie_rating = {
  id: String, // Movie ID
  rate: Number, // Rating given by the user
  last_updated: Date, // Date when the rating was last updated
};

// Define the schema for the User model
const user_schema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    index: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  movies_rated: {
    type: [movie_rating], // Array of movie ratings using the subdocument schema
    required: false,
    index: true,
  },
  created_at: {
    type: Date,
    required: true,
    default: Date.now(),
  },
  status: {
    type: String, // User status (verified, pending, suspended)
    required: true,
    default: "verified",
  },
});

// Define a virtual property to access rated movies
user_schema.virtual("rated_movies", function () {
  return this.movies_rated;
});

// Method to rate a movie
user_schema.method("rate_movie", async function (movie_id, rating) {
  try {
    let already_rated = false;
    for (let movie of this.movies_rated) {
      if (movie_id === movie.id) {
        // Update the rating of a movie that the user has already rated
        const movie_obj = await Movie.findOne({ id: movie_id });
        movie_obj.rerate(rating, parseInt(movie.rate));

        movie.rate = rating;
        movie.last_updated = Date.now();

        already_rated = true;

        await this.save();
        break;
      }
    }

    if (!already_rated) {
      // Rate a movie if the user has not rated it before
      const movie = await Movie.findOne({ id: movie_id });
      if (movie) {
        movie.rate(rating);
        this.movies_rated.push({
          id: movie_id,
          rate: rating,
          last_updated: Date.now(),
        });
        await this.save();
      } else {
        throw Error("Movie does not exist");
      }
    }

    return this.movies_rated;
  } catch (error) {
    throw error;
  }
});

// Create the User model using the schema
const User = mongoose.model("User", user_schema);

export default User;
