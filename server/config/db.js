import mongoose from "mongoose";

// Connection URI
const uri = "mongodb://localhost:27017/employeeDB";

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