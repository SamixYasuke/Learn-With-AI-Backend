import mongoose, { Schema, Document, Types } from "mongoose";

interface QuestionDetail {
  question_text: string;
  options?: string[];
  correct_answer?: string;
}

interface IQuestion extends Document {
  user_id: Types.ObjectId;
  note_id: Types.ObjectId;
  question_type: "multiple_choice" | "true_false";
  number_of_questions: 5 | 10 | 20;
  difficulty: "easy" | "medium" | "hard";
  questions: QuestionDetail[];
  score?: number;
  grade?: "A" | "B" | "C" | "D" | "F";
  is_graded: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const QuestionDetailSchema = new Schema<QuestionDetail>({
  question_text: {
    type: String,
    required: true,
  },
  options: {
    type: [String],
    default: undefined,
  },
  correct_answer: {
    type: String,
    default: undefined,
  },
});

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
      enum: ["multiple_choice", "true_false"],
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
    questions: {
      type: [QuestionDetailSchema],
      required: true,
    },
    score: {
      type: Number,
    },
    grade: {
      type: String,
      enum: ["A", "B", "C", "D", "F"],
    },
    is_graded: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
);

const Question = mongoose.model<IQuestion>("Question", QuestionSchema);

export default Question;
