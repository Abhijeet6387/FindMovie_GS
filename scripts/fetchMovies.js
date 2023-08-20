// import fetch from 'node-fetch';
// import fs from 'node:fs';
// import {program} from 'commander';
// import dotenv from 'dotenv';
// dotenv.config({
//     path: '../.env',
// });

// program
//     .description(`This script fetches latest movies from TMDB API. Outputs to stdout in JSON`)
//     .option(`-p, --page <page>`, 'sets the page number to fetch, can be single int or range, for example, 1-5', '1')
//     .option(`-k, --key <key>`, 'sets the API key (V3) used for fetch request', 'null');

// program.parse();

// const options = program.opts();

// //Process --page
// const page_option = String(options.page);
// const page_arr = page_option.split('-');
// let page_start = 1, page_end = 1;
// let multiple_page = false;
// if(page_arr.length > 1){
//     // accept range of pages
//     const pages = page_arr.map((val, idx, page_arr) => parseInt(val));
//     page_start = pages[0];
//     page_end = pages[1];
//     if(page_start && page_end && page_start > 0 && page_end > 0 && page_start <= page_end){
//         if(page_start<page_end){
//             multiple_page = true;
//         }
//     }
//     else{
//         console.error('Page(s) must be an int, greater than 0 and in increasing order');
//         process.exit(1);
//     }
// }
// else{
//     const p = parseInt(page_arr[0]);
//     if(p && p>0){
//         page_start = p;
//         page_end = p;
//     }
//     else{
//         console.error('Page(s) must be an int, greater than 0 and in increasing order');
//         process.exit(0);
//     }
// }

// // process --key
// let api_key = process.env.TMDB_KEY || null;

// const k = String(options.key);
// if(k !== 'null'){
//     api_key = k;
// }

// if(api_key === null){
//     console.error('API key must be provided, default key can be set in root .env file');
//     process.exit(1);
// }


// //generate API endpoint
// const getEndpoint = (api) => {
//     let url = `https://api.themoviedb.org/3/discover/movie?api_key=${api}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false`;
//     return (page) => url + `&page=${page}`;
// };

// const protected_endpoint = getEndpoint(api_key);

// let result = [];

// if(multiple_page){
//     for(let p = page_start; p<=page_end; p++){
//         let url = protected_endpoint(p);
//         try{
//             const res = await fetch(url);
//             const data = await res.json();
//             const movies = data.results;
//             for(let movie of movies){
//                 result.push(Object.assign({}, {
//                     id: movie.id,
//                     genre_ids: movie.genre_ids,
//                     title: movie.title,
//                     original_language: movie.original_language,
//                     overview: movie.overview,
//                     poster_path: movie.poster_path,
//                     release_date: movie.release_date,
//                 }));
//             }
//         } catch (error) {
//             console.error('Error fetching response, most probably request was rate-limited and hence denied. Try again in a moment.');
//             console.error(error);
//             process.exit(1);
//         }
        
//     }

// }
// else{
//     let url = protected_endpoint(page_start);
//     try{
//         const res = await fetch(url);
//         const data = await res.json();
//         const movies = data.results;
//         for(let movie of movies){
//             result.push(Object.assign({}, {
//                 id: movie.id,
//                 genre_ids: movie.genre_ids,
//                 title: movie.title,
//                 original_language: movie.original_language,
//                 overview: movie.overview,
//                 poster_path: movie.poster_path,
//                 release_date: movie.release_date,
//             }));
//         }
//     } catch (error) {
//         console.error('Error fetching response, most probably request was rate-limited and hence denied. Try again in a moment.');
//         console.error(error);
//         process.exit(1);
//     }

// }

// //write to stdout
// fs.writeFileSync(process.stdout.fd, JSON.stringify(result));
// fs.close(process.stdout.fd);


import fetch from "node-fetch";
import fs from "node:fs";
import { program } from "commander";
import dotenv from "dotenv";

dotenv.config({
  path: "../.env",
});

program
  .description(
    `This script fetches latest movies from TMDB API. Outputs to stdout in JSON`
  )
  .option(
    `-p, --page <page>`,
    "sets the page number to fetch, can be single int or range, for example, 1-5",
    "1"
  )
  .option(
    `-k, --key <key>`,
    "sets the API key (V3) used for fetch request",
    "null"
  );

program.parse();

const options = program.opts();

// Process --page
const page_option = String(options.page);
const page_arr = page_option.split("-");
let page_start = 1,
  page_end = 1;
let multiple_page = false;
if (page_arr.length > 1) {
  // Accept a range of pages
  const pages = page_arr.map((val, idx, page_arr) => parseInt(val));
  page_start = pages[0];
  page_end = pages[1];
  if (
    page_start &&
    page_end &&
    page_start > 0 &&
    page_end > 0 &&
    page_start <= page_end
  ) {
    if (page_start < page_end) {
      multiple_page = true;
    }
  } else {
    console.error(
      "Page(s) must be an integer, greater than 0, and in increasing order"
    );
    process.exit(1);
  }
} else {
  const p = parseInt(page_arr[0]);
  if (p && p > 0) {
    page_start = p;
    page_end = p;
  } else {
    console.error(
      "Page(s) must be an integer, greater than 0, and in increasing order"
    );
    process.exit(1);
  }
}

// Process --key
let api_key = process.env.TMDB_KEY || null;

const k = String(options.key);
if (k !== "null") {
  api_key = k;
}

if (api_key === null) {
  console.error(
    "API key must be provided, the default key can be set in the root .env file"
  );
  process.exit(1);
}

// Generate API endpoint
const getEndpoint = (api) => {
  let url = `https://api.themoviedb.org/3/discover/movie?api_key=${api}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false`;
  return (page) => url + `&page=${page}`;
};

const protected_endpoint = getEndpoint(api_key);

let result = [];

// Fetch movies function
async function fetchMovies(page) {
  try {
    const url = protected_endpoint(page);
    const res = await fetch(url);

    if (res.status === 429) {
      // Rate limit exceeded
      console.error("Rate limit exceeded. Try again in a moment.");
      process.exit(1);
    }

    const data = await res.json();
    const movies = data.results;
    for (let movie of movies) {
      result.push({
        id: movie.id,
        genre_ids: movie.genre_ids,
        title: movie.title,
        original_language: movie.original_language,
        overview: movie.overview,
        poster_path: movie.poster_path,
        release_date: movie.release_date,
      });
    }
  } catch (error) {
    console.error("Error fetching response:", error);
    process.exit(1);
  }
}

// Main function
async function main() {
  if (multiple_page) {
    for (let p = page_start; p <= page_end; p++) {
      await fetchMovies(p);
    }
  } else {
    await fetchMovies(page_start);
  }

  // Output the result as JSON to stdout
  console.log(JSON.stringify(result, null, 2));
}

main();
