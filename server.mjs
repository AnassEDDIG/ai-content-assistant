// Importing required modules
import app from "./app.mjs";
import cors from "cors";
import helmet from "helmet"; // Adds security-related HTTP headers
import rateLimit from "express-rate-limit"; // Protects against brute-force & DDoS attacks
import mongoSanitize from "express-mongo-sanitize"; // Prevents NoSQL injection
import hpp from "hpp"; // Prevents HTTP Parameter Pollution
import cookieParser from "cookie-parser";
import connectToDB from "./config/connectToDB.mjs";
import promptRoutes from "./routes/promptRoutes.mjs";
import authRoutes from "./routes/authRoutes.mjs";
import userRoutes from "./routes/userRoutes.mjs";
import errorMiddleware from "./utils/errorMiddleware.mjs";
import express from "express";

// Apply security-related HTTP headers
app.use(helmet());

// Define allowed frontend origins
const allowedOrigins = ["http://localhost:5173"];
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true, // Allows cookies and authorization headers
  })
);

// Parse incoming cookies
app.use(cookieParser());

// Rate limiting to avoid abuse and DDoS
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  max: 100, // Limit each IP to 100 requests per window
  message: "Too many requests from this IP, please try again later.",
});
app.use("/api", limiter);

// Body parsers and sanitization middleware
app.use(express.json({ limit: "10kb" })); // Limit body size to prevent payload flooding
app.use((req, res, next) => {
  mongoSanitize.sanitize(req.body);
  mongoSanitize.sanitize(req.params);
  next();
});
app.use(hpp()); // Protect against HTTP Parameter Pollution

// Replace password placeholder and connect to MongoDB Atlas
const uri = process.env.DB_URI.replace(
  "<db_password>",
  process.env.DB_PASSWORD
);
connectToDB(uri);

// Load environment variables
const port = process.env.PORT || "3000";
const host = process.env.HOST || "localhost";

// Health check route
app.get("/", (req, res) => {
  res.json({ status: "success", message: "All good to go!" });
});

// Application routes
app.use("/api/prompt", promptRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

// Centralized error handling middleware
app.use(errorMiddleware);

// Start server
app.listen(port, host, () => {
  console.log(`App running on http://${host}:${port}`);
});
