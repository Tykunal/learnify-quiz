// // app/api/quiz/user/route.ts
// import { NextResponse } from "next/server";
// import mongoose from "mongoose";
// import User from "../../../../models/User";  // Corrected path to User model

// // MongoDB connection helper
// async function connectToDatabase() {
//   if (mongoose.connections[0].readyState) {
//     // If a connection is already established
//     return;
//   }

//   await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/mango");
// }

// export async function POST(req: Request) {
//   // Connect to the database
//   await connectToDatabase();

//   try {
//     const { name, email, phone } = await req.json();

//     // Create a new user
//     const newUser = new User({ name, email, phone });

//     // Save the user in the database
//     await newUser.save();

//     // Respond with a success message
//     return NextResponse.json({ message: "User saved successfully", user: newUser }, { status: 201 });
//   } catch (error) {
//     console.error("Error saving user:", error);
//     return NextResponse.json({ message: "Error saving user" }, { status: 500 });
//   }
// }


// app/api/quiz/user/route.ts
import { NextResponse } from "next/server";
// import mongoose from "mongoose";
import User from "../../../../models/User"; // Correct path to the User model

import connectDB from "@/lib/mongodb";

// // MongoDB connection helper
// async function connectToDatabase() {
//   if (mongoose.connections[0].readyState) {
//     // If a connection is already established
//     return;
//   }
//   const test: string = "'define mongodb string properly'";
//   await mongoose.connect(process.env.MONGO_URI || test);
// }

export async function POST(req: Request) {
  // Connect to the database
  await connectDB();

  try {
    const { email, name, phone } = await req.json();

    // Check if the email already exists in the database
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      // If the user already exists, respond with an error message
      return NextResponse.json({ message: "You have already submitted the form" }, { status: 400 });
    }

    // Create a new user if the email does not exist
    const newUser = new User({ name, email, phone });

    // Save the new user to the database
    await newUser.save();

    // After successfully saving, navigate the user to the quiz page
    return NextResponse.json({ message: "User saved successfully, quiz will open now", user: newUser, redirectTo: "/quiz" }, { status: 201 });

  } catch (error) {
    console.error("Error saving user:", error);
    return NextResponse.json({ message: "Error saving user" }, { status: 500 });
  }
}
