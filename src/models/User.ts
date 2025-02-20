


import mongoose, { Document, Schema } from "mongoose";

// Define the IUser interface for TypeScript
interface IUser extends Document {
  name: string;
  email: string;
  phone: number;
  score: number;  // Add score to the IUser interface
  createdAt: Date;
  updatedAt: Date;
}

// Define the User schema with additional validations
const UserSchema = new Schema<IUser>({
  name: { 
    type: String, 
    required: [true, "Name is required"],
    trim: true, // Automatically trims leading and trailing spaces
  },
  email: { 
    type: String, 
    required: [true, "Email is required"], 
    unique: true,
    lowercase: true, // Ensure email is stored in lowercase
    // match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Please provide a valid email address"],  // Email regex validation
  },
  phone: { 
    type: Number, 
    required: [true, "Phone number is required"],
    // match: [/^\+?[1-9]\d{1,14}$/, "Please provide a valid phone number"], // Phone number regex validation (E.164 format)
  },
  score: { 
    type: Number, 
    required: [true, "Score is required"], 
    default: 0, 
    min: [0, "Score cannot be negative"],  // Ensure score cannot be negative
  },
}, { 
  timestamps: true, // Automatically handle createdAt and updatedAt
});

// Create and export the User model
const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
