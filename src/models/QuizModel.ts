import { Schema, model, models } from "mongoose";

const QuizSchema = new Schema({
  question: { type: String, required: true },
  options: { type: [String], required: true },
  correctAnswerIndex: { type: Number, required: true },
});

const Quiz = models.Quiz || model("Quiz", QuizSchema);

export default Quiz;
