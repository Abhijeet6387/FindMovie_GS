import mongoose from "mongoose";

// Define a function to connect to the MongoDB database
const connect = async () => {
  // Get the credentials from .env file
  const credentials = {
    url: process.env.DB_URL,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
  };

  // Define the connection URL for MongoDB
  let connection_url = credentials.url;
  if (!credentials.url) {
    // If URL is not provided in .env, create a connection URL using username and password
    connection_url = `mongodb+srv://${credentials.username}:${credentials.password}@cluster0.qfdmpt7.mongodb.net/?retryWrites=true&w=majority`;
  }

  // Attempt to connect to the MongoDB database
  await mongoose.connect(connection_url);

  // Get a reference to the database connection
  const db_handle = mongoose.connection;

  // Event handler for successful database connection
  db_handle.on("open", () => {
    // Check if the environment is set to "development" and log a success message
    if (process.env.NODE_ENV === "development") {
      console.log("Connected to the Database successfully");
    }
  });

  // Event handler for database connection errors
  db_handle.on("error", (err) => {
    // Check if the environment is set to "development" and log an error message
    if (process.env.NODE_ENV === "development") {
      console.error(`Error connecting to the Database:\n${err}`);
    }
  });
};

// Export the connect function for external use
export default connect;
