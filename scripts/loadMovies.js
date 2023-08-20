// import { program } from "commander";
// import dotenv from "dotenv";
// import mongoose from "mongoose";
// import Movie from "../models/Movie.js";

// dotenv.config({
//   path: "../.env",
// });

// const credentials = {
//   url: process.env.DB_URL,
//   username: process.env.DB_USERNAME,
//   password: process.env.DB_PASSWORD,
  
// };

// program
//   .description(
//     `This script reads stdin for JSON array of movies and upload entries to the database.`
//   )
//   .option("-u, --url <url>", "sets the database connection URL", "null")
//   .parse(process.argv);

// const options = program.opts();

// let database_url = credentials.url;
// if (options.url === "null") {
//   if (!credentials.url) {
//     database_url = `mongodb+srv://${credentials.username}:${credentials.password}@cluster0.qfdmpt7.mongodb.net/?retryWrites=true&w=majority`;
//   }
// } else {
//   database_url = options.url;
// }

// (async () => {
//   try {
//     await mongoose.connect(database_url);
//     const db_handle = mongoose.connection;
//     db_handle.on("open", () => {
//       console.log(`Connected to the database`);
//     });

//     db_handle.on("error", (err) => {
//       console.error(`Error connecting to the database`);
//       console.error(err);
//       process.exit(1);
//     });

//     const chunks = [];
//     process.stdin.on("data", (chunk) => {
//       chunks.push(chunk);
//     });

//     process.stdin.on("end", async () => {
//       const json_data = JSON.parse(Buffer.concat(chunks).toString());

//       console.log("Upserting data in DB");
//       for (let movie of json_data) {
//         await Movie.findOneAndUpdate(
//           { id: movie.id },
//           {
//             id: movie.id,
//             genre_ids: movie.genre_ids,
//             title: movie.title,
//             orignal_language: movie.orignal_language,
//             overview: movie.overview,
//             poster_path: movie.poster_path,
//             release_date: movie.release_date,
//             rate_sum: 0,
//             rate_count: 0,
//           },
//           { upsert: true }
//         );
//       }
//       console.log("Upsertion complete");
//       process.exit(0);
//     });
//   } catch (error) {
//     console.error("Error connecting to the database or parsing JSON data");
//     console.error(error);
//     process.exit(1);
//   }
// })();


import { program } from "commander";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Movie from "../models/Movie.js";

dotenv.config({
  path: "../.env",
});

const credentials = {
  url: process.env.DB_URL,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
};

program
  .description(
    `This script reads stdin for a JSON array of movies and uploads entries to the database.`
  )
  .option("-u, --url <url>", "sets the database connection URL", "null")
  .parse(process.argv);

const options = program.opts();

let database_url = credentials.url;

// Check if the --url option was provided, otherwise use the default URL
if (options.url === "null") {
  if (!credentials.url) {
    database_url = `mongodb+srv://${credentials.username}:${credentials.password}@cluster0.qfdmpt7.mongodb.net/?retryWrites=true&w=majority`;
  }
} else {
  database_url = options.url;
}

(async () => {
  try {
    await mongoose.connect(database_url);
    const db_handle = mongoose.connection;

    // Database connection successful
    db_handle.on("open", () => {
      console.log(`Connected to the database`);
    });

    // Handle database connection errors
    db_handle.on("error", (err) => {
      console.error(`Error connecting to the database`);
      console.error(err);
      process.exit(1);
    });

    const chunks = [];

    // Listen for incoming data from stdin
    process.stdin.on("data", (chunk) => {
      chunks.push(chunk);
    });

    // When stdin ends, parse the collected JSON data and upsert it into the database
    process.stdin.on("end", async () => {
      const json_data = JSON.parse(Buffer.concat(chunks).toString());

      console.log("Upserting data in DB");
      for (let movie of json_data) {
        await Movie.findOneAndUpdate(
          { id: movie.id },
          {
            id: movie.id,
            genre_ids: movie.genre_ids,
            title: movie.title,
            original_language: movie.original_language, 
            overview: movie.overview,
            poster_path: movie.poster_path,
            release_date: movie.release_date,
            rate_sum: 0,
            rate_count: 0,
          },
          { upsert: true }
        );
      }
      console.log("Upsertion complete");
      process.exit(0);
    });
  } catch (error) {
    console.error("Error connecting to the database or parsing JSON data");
    console.error(error);
    process.exit(1);
  }
})();
