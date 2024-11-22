import mongoose, { Schema, Document } from "mongoose";

export interface IIncome extends Document {
  user_id: Schema.Types.ObjectId;
  category_id: Schema.Types.ObjectId;
  required_amount: number;
  accumulated_amount: number;
}

const IncomeSchema: Schema = new Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    category_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Category",
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

export const Income = mongoose.model<IIncome>("Income", IncomeSchema);
