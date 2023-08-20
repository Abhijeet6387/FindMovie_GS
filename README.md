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
 - PORT | 5000 : specifies the port number on which server will respond.
 - TMDB_KEY | (No default) : Used for seeding Database from movies APIs of TMDB.
 - JWT_SECRET | (grow_simplee) : JWT secret used for verifying jwt token sent from client.
 - DB_URL | (mongodb://127.0.0.1:27017/demo) : database connection url, **if this env variable is set below (3) env variables will be ignored**
 - DB_USERNAME | (No default) : sets the username for database connection
 - DB_PASSWORD | (No default) : sets the password for database connection
 - DB_NAME | (No default) : sets the database to perform manipulation.

(Basic .env file)
 ```
PORT=5000
DB_URL=mongodb://127.0.0.1:27017/demo
JWT_SECRET=grow_simplee
 ```

## Build & Run (& local test)

### Pre-requisites
 - Make sure system has NodeJS v16 or above
 - Make sure system has npm compatible with current node version
 - Make sure system has MongoDB server installed and *mongod* service is running.
 - You have the TMDB key to seed the database with movies (Add in .env file)

### Steps
 - To install production dependencies
 ```bash
 npm install
 ```
 -  (optional) To seed the database with trending movies (first 3 pages using default .env file)
 ```bash
 cd scripts/
 node fetch_movies.js -p 1-3 | node load_movies.js
 ```
 *Note: use --help flag in scripts to know args*

 - Run REST server
 ```bash
 npm start
 ```

## Postman Docs

Link: https://documenter.getpostman.com/view/12996761/UyrGBEHZ