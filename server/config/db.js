import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config(); // Load environment variables from .env file
// Connection URI
const uri = process.env.MONGO_URI || "mongodb://localhost:27017/business_management_portal";

// Connect to MongoDB
mongoose.connect(uri)
  .then(() => {
    console.log("✅ Connected to MongoDB successfully");
  })
  .catch((error) => {
    console.error("❌ Error connecting to MongoDB:", error.message);
    process.exit(1); // Exit process if connection fails
  });

// Optional: Handle connection events
mongoose.connection.on("disconnected", () => {
  console.warn("⚠️ MongoDB connection lost. Attempting to reconnect...");
});