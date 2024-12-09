const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const corsOptions = {
  origin: process.env.ALLOWED_CORS_ORIGIN || "*", // Dynamically allow origins
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Routes
const userRoutes = require("./routes/User-Routes.js");
const courseRoutes = require("./routes/Course-Routes.js");

// MongoDB Connection with error handling
mongoose.connect(process.env.MONGODB_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("error", (error) => {
  console.error("MongoDB connection error:", error);
});

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB Atlas successfully");
});

// Define routes
app.use("/users", userRoutes);
app.use("/courses", courseRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message });
});

// Start the server
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`API is now connected on port ${port}`);
});
