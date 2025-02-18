
// import { NextApiRequest, NextApiResponse } from "next";
// import { connectToDatabase } from "@/lib/mongodb"; // Import the MongoDB connection helper
// import User from "@/models/User"; // Import the User model

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method !== "POST") {
//     return res.status(405).json({ error: "Method Not Allowed" });
//   }

//   // Connect to the database
//   await connectToDatabase();

//   try {
//     const { name, email, phone } = req.body; // Extract the user data from the request body

//     // Create a new user
//     const newUser = new User({ name, email, phone });

//     // Save the user in the database
//     await newUser.save();

//     // Return a success response
//     return res.status(201).json({ message: "User saved successfully", user: newUser });
//   } catch (error) {
//     // If an error occurs, return an error response
//     return res.status(500).json({ error: "Failed to save user" });
//   }
// }


import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/mongodb"; // Import the MongoDB connection helper
import User from "@/models/User"; // Import the User model

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  // Connect to the database
  await connectToDatabase();

  try {
    const { name, email, phone } = req.body; // Extract the user data from the request body

    // Create a new user
    const newUser = new User({ name, email, phone });

    // Save the user in the database
    await newUser.save();

    // Return a success response
    return res.status(201).json({ message: "User saved successfully", user: newUser });
  } catch (error) {
    // If an error occurs, return an error response and log the error
    console.error("Error saving user:", error); // Log the error for debugging
    return res.status(500).json({ error: "Failed to save user", details: error.message }); // Return the error details
  }
}
