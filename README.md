# Grow Simplee Assignment

## Tasks

Datasource: https://developers.themoviedb.org/3/getting-started/introduction

 - [x] Collect movie data from the above api and store it in your db.
 - [x] Allows user to register into your application.
 - [x] Allows user to login using username and password, and return access token as response.
 - [x] Using the access token user can retrieve movie list.
 - [x] Using access token user can rate a movie.
 - [x] An open api to look at the average the rating of each movie. If movie is unrated, return NA.

## Env Variables
 - PORT : Specifies the port number for server
 - TMDB_KEY : API key from TMDB.
 - JWT_SECRET : JWT secret key for hashing credentials.
 - DB_URL : Database connection url
 - DB_USERNAME : Sets the username for database connection
 - DB_PASSWORD : Sets the password for database connection


### Pre-requisites
 - Make sure system has NodeJS v16 or above
 - Make sure system has npm compatible with current node version
 - Make sure system has MongoDB server installed
 - You have the TMDB key to seed the database with movies

### Steps
 - To install production dependencies
 ```bash
 npm install
 ```
 - To store the movies from the API in the database
 ```bash
 cd scripts/
 node fetchMovies.js -p 1-3 | node loadMovies.js
 ```

 - Run server
 ```bash
 node server
 ```

## Postman Docs

Link: https://docs.google.com/document/d/1C_W6QS5_L5ukK6HBIwX3faAxuF5xj8Aznpst7hVBB3A/edit?usp=sharing
