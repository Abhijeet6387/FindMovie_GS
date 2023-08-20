import mongoose from "mongoose";

// Define the schema for the Movie model
const movie_schema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    index: true,
    unique: true,
  },
  genre_ids: {
    type: [String],
    required: false,
  },
  title: {
    type: String,
    required: true,
    index: true,
  },
  original_language: {
    type: String,
    required: false,
  },
  overview: {
    type: String,
    required: false,
    index: true,
  },
  poster_path: {
    type: String,
    required: false,
  },
  release_date: {
    type: Date,
    required: false,
  },
  rate_sum: {
    type: Number,
    required: true,
    default: 0,
  },
  rate_count: {
    type: Number,
    required: true,
    default: 0,
  },
});

// Define methods for the Movie model

// Method to update the rating of a movie
movie_schema.method("rerate", function (new_rating, old_rating) {
  if (new_rating > 0 && new_rating <= 5 && old_rating > 0 && old_rating <= 5) {
    if (this.rate_sum + new_rating - old_rating >= 0) {
      this.rate_sum += new_rating - old_rating;
      this.save();
    } else {
      throw Error("Inconsistent rating update. Try again later");
    }
  } else {
    throw Error("Rating can only be in between 1 to 5");
  }
});

// Method to add a new rating to a movie
movie_schema.method("rate", function (rating) {
  if (rating > 0 && rating <= 5) {
    this.rate_sum += rating;
    this.rate_count += 1;
    this.save();
  } else {
    throw Error("Rating can only be in between 1 to 5");
  }
});

// Virtual property to calculate the average rating of a movie
movie_schema.virtual("average_rating").get(function () {
  return this.rate_count > 0 ? this.rate_sum / this.rate_count : "NA";
});

// Create the Movie model using the schema
const Movie = mongoose.model("Movie", movie_schema);

export default Movie;
