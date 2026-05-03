const express = require("express");
const colors = require("colors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");

// dotenv config
dotenv.config();

// MongoDB connection
connectDB();

// Express app initialization
const app = express();

// Middlewares
app.use(express.json()); // To parse JSON data in requests
app.use(morgan("dev")); // For logging HTTP requests in development
app.use(cors()); // For handling CORS (Cross-Origin Resource Sharing)

// Routes
app.use("/api/v1/user", require("./routes/userRoutes"));
app.use("/api/v1/admin", require("./routes/adminRoutes"));
app.use("/api/v1/doctor", require("./routes/doctorRoutes"));

// Test route to check server is working
app.get("/", (req, res) => {
  res.send("Server is up and running!");
});

// General error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: "Something went wrong!" });
});

// Port configuration
const port = process.env.PORT || 5000;

// Server listening
app.listen(port, () => {
  console.log(
    `Server Running in ${process.env.NODE_ENV || "development"} Mode on port ${port}`.bgCyan.white
  );
});
