import mongoose, { Schema, Document, Mongoose } from "mongoose";

export interface IGoal extends Document {
  name: Schema.Types.ObjectId;
  user_id: Schema.Types.ObjectId;
  required_amount: number;
  accumulated_amount: number;
  goal_percentage: Number;
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
    goal_percentage: {
      type: Number,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Goal = mongoose.model<IGoal>("Goal", GoalSchema);
