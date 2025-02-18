// import mongoose, { Connection } from "mongoose";

// // MongoDB URI (use environment variable or fallback)
// const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/mango";

// // Global cache object for MongoDB connection
// interface MongooseCache {
//   conn: Connection | null;
//   promise: Promise<typeof mongoose> | null;
// }

// // ✅ Extend the globalThis type to include mongooseCache
// declare global {
//   namespace NodeJS {
//     interface Global {
//       mongooseCache?: MongooseCache;
//     }
//   }
// }

// // Use existing global cache or initialize a new one
// const globalWithMongoose = global as typeof global & { mongooseCache?: MongooseCache };

// const cached: MongooseCache = globalWithMongoose.mongooseCache || { conn: null, promise: null };

// export const connectToDatabase = async () => {
//   // Use cached connection if available
//   if (cached.conn) {
//     console.log("Already connected to MongoDB (cached)");
//     return cached.conn;
//   }

//   if (!cached.promise) {
//     cached.promise = mongoose
//       .connect(MONGO_URI, { dbName: "mango" })
//       .then((mongooseInstance) => {
//         console.log("MongoDB connected successfully with mongoose");
//         cached.conn = mongooseInstance.connection;
//         return mongooseInstance;
//       })
//       .catch((error) => {
//         console.error("MongoDB connection error:", error);
//         throw error;
//       });
//   }

//   cached.conn = (await cached.promise).connection;

//   // ✅ Save to global object (helps in serverless environments)
//   globalWithMongoose.mongooseCache = cached;

//   return cached.conn;
// };


import mongoose, { Connection } from "mongoose";

// MongoDB URI (use environment variable or fallback)
const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/mango";

// Global cache object for MongoDB connection
interface MongooseCache {
  conn: Connection | null;
  promise: Promise<typeof mongoose> | null;
}

// Extend the global object with mongooseCache
declare global {
  let mongooseCache: MongooseCache | undefined;  // Directly extend global
}

// Use existing global cache or initialize a new one
const globalWithMongoose = global as typeof global & { mongooseCache?: MongooseCache };

const cached: MongooseCache = globalWithMongoose.mongooseCache || { conn: null, promise: null };

export const connectToDatabase = async () => {
  // Use cached connection if available
  if (cached.conn) {
    console.log("Already connected to MongoDB (cached)");
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGO_URI, { dbName: "mango" })
      .then((mongooseInstance) => {
        console.log("MongoDB connected successfully with mongoose");
        cached.conn = mongooseInstance.connection;
        return mongooseInstance;
      })
      .catch((error) => {
        console.error("MongoDB connection error:", error);
        throw error;
      });
  }

  cached.conn = (await cached.promise).connection;

  // Save to global object (helps in serverless environments)
  globalWithMongoose.mongooseCache = cached;

  return cached.conn;
};
