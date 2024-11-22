import mongoose, { Schema, Document, Mongoose } from "mongoose";

export interface IGoal extends Document {
  user_id: Schema.Types.ObjectId;
  category_id: Schema.Types.ObjectId;
  required_amount: number;
  accumulated_amount: number;
}

const GoalSchema: Schema = new Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    name: {
      type: String,
      required: true,
    },
    required_amount: {
      type: Number,
      required: true,
    },
    accumulated_amount: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const Goal = mongoose.model<IGoal>("Goal", GoalSchema);
