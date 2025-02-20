import { NextResponse } from "next/server";
// import { MongoClient } from "mongodb";
import connectDB from "@/lib/mongodb";
import Quiz from "@/models/QuizModel";

// const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017";
// const DB_NAME = "mango"; 

export async function GET() {
  try {
    // const client = await MongoClient.connect(MONGO_URI, {});

    // const db = client.db(DB_NAME);
    // const collection = db.collection("quiz"); // Your collection name

    // const questions = await collection.find({}).toArray();
    // client.close();

    await connectDB();
    const questions = await Quiz.find({});

    if (!questions || questions.length === 0) {
      return NextResponse.json({ message: "No questions found" }, { status: 404 });
    }

    return NextResponse.json(questions, { status: 200 });
  } catch (error) {
    console.error(" Error fetching quiz data:", error);
    return NextResponse.json({ message: "Error fetching quiz data" }, { status: 500 });
  }
};
