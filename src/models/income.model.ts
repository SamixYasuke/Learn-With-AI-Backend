import mongoose, { Schema, Document } from "mongoose";

export interface IIncome extends Document {
  user_id: Schema.Types.ObjectId;
  category_id: Schema.Types.ObjectId;
  name: string;
  required_amount: number;
  accumulated_amount: number;
  income_percentage: number;
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
    income_percentage: {
      type: Number,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Income = mongoose.model<IIncome>("Income", IncomeSchema);
