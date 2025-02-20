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


// Earlier running code is below: 

// import mongoose, { Connection } from "mongoose";

// // MongoDB URI (use environment variable or fallback)
// const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/mango";

// // Global cache object for MongoDB connection
// interface MongooseCache {
//   conn: Connection | null;
//   promise: Promise<typeof mongoose> | null;
// }

// // Extend the global object with mongooseCache
// declare global {
//   let mongooseCache: MongooseCache | undefined;  // Directly extend global
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

//   // Save to global object (helps in serverless environments)
//   globalWithMongoose.mongooseCache = cached;

//   return cached.conn;
// };


import mongoose from 'mongoose';
import dotenv from "dotenv";

dotenv.config({ path: '.env.local' });

const MONGO_URI: string = process.env.MONGO_URI || "random String";

if (MONGO_URI === "random String") {
  throw new Error("Define MongoDB connection string properly.");
}

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  try {
    await mongoose.connect(MONGO_URI);
    console.log(`Database Connected with ${mongoose.connection.host}`);
  } catch (error) {
    console.error('Database connection failed:', error);
    throw new Error('Database connection failed');
  }
};

export default connectDB;
