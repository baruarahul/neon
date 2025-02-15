const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const connectDB = require("./config/database");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(helmet()); // Security headers
app.use(morgan("dev")); // Logger for requests

// Conditionally Load Swagger in Development
if (process.env.NODE_ENV === "development") {
  const swaggerSetup = require("./config/swagger");
  swaggerSetup(app);
}

// Dynamically Load All Routes from `routes/` Folder
const routesPath = path.join(__dirname, "routes");
fs.readdirSync(routesPath).forEach((file) => {
  if (file.endsWith(".routes.js")) {
    const route = require(path.join(routesPath, file));
    const routeName = file.replace(".routes.js", "");
    app.use(`/api/${routeName}`, route);
  }
});

// Health Check Route
app.get("/", (req, res) => {
  res.json({ message: "🚀 Neon Signage API is running" });
});

// Global Error Handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

module.exports = app;
