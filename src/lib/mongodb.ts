import mongoose from "mongoose";

// MongoDB URI (we’ll use process.env.MONGODB_URI as before)
const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/mango";

let cached = (global as any).mongoose || { conn: null, promise: null };

// Connect to MongoDB
export const connectToDatabase = async () => {
  // Use the cached connection if it exists
  if (cached.conn) {
    console.log("Already connected to MongoDB (cached)");
    return cached.conn;
  }

  if (!cached.promise) {
    // Use mongoose to connect, and cache the connection for further use
    cached.promise = mongoose
      .connect(MONGO_URI, {
        dbName: "mango", // Ensure you're using the correct DB name
      })
      .then((mongooseInstance) => {
        console.log("MongoDB connected successfully with mongoose");
        cached.conn = mongooseInstance;
        return mongooseInstance;
      })
      .catch((error) => {
        console.error("MongoDB connection error:", error);
        throw error;
      });
  }

  // Wait for the promise to resolve
  await cached.promise;
  return cached.conn;
};
