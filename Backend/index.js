import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";

import userRoute from "./routes/user.route.js";
import messageRoute from "./routes/message.route.js";
import { app, server } from "./SocketIO/server.js";

dotenv.config();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173", // Frontend URL
    credentials: true, // Allow cookies
  })
);

const PORT = process.env.PORT || 3001;
const URI = process.env.MONGODB_URI;

// MongoDB Connection Function
const connectDB = async () => {
  try {
    await mongoose.connect(URI); // Removed deprecated options
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    process.exit(1);
  }
};

// Connect to MongoDB before starting server
connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`🚀 Server is Running on port ${PORT}`);
  });
});

// Routes
app.use("/api/user", userRoute);
app.use("/api/message", messageRoute);
