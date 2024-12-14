import mongoose, { Schema, Document, Types } from "mongoose";

interface IQuestion extends Document {
  user_id: Types.ObjectId;
  note_id: Types.ObjectId;
  question_type: "multiple_choice" | "true_false" | "long_answer";
  number_of_questions: 5 | 10 | 20;
  difficulty: "easy" | "medium" | "hard";
  question_text: string;
  options?: string[];
  correct_answer?: string;
  expected_answer?: string;
  score?: number;
  grade?: "A" | "B" | "C" | "D" | "E" | "F";
  is_graded: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const QuestionSchema = new Schema<IQuestion>(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    note_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Note",
      required: true,
    },
    question_type: {
      type: String,
      required: true,
      enum: ["multiple_choice", "true_false", "long_answer"],
    },
    number_of_questions: {
      type: Number,
      required: true,
      enum: [5, 10, 20],
    },
    difficulty: {
      type: String,
      required: true,
      enum: ["easy", "medium", "hard"],
    },
    question_text: {
      type: String,
      required: true,
    },
    options: {
      type: [String],
    },
    correct_answer: {
      type: String,
    },
    expected_answer: {
      type: String,
    },
    score: {
      type: Number,
    },
    grade: {
      type: String,
      enum: ["A", "B", "C", "D", "E", "F"],
    },
    is_graded: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

const Question = mongoose.model<IQuestion>("Question", QuestionSchema);

export default Question;
