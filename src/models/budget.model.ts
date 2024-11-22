import mongoose, { Schema, Document } from "mongoose";

export interface IBudget extends Document {
  budget_name: string;
  user_id: Schema.Types.ObjectId;
  total_income: number;
  needs_budget: number;
  wants_budget: number;
  savings_budget: number;
}

const BudgetSchema: Schema = new Schema(
  {
    budget_name: {
      type: String,
      required: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    total_income: {
      type: Number,
      required: true,
    },
    needs_budget: {
      type: Number,
      required: false,
    },
    wants_budget: {
      type: Number,
      required: false,
    },
    savings_budget: {
      type: Number,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Budget = mongoose.model<IBudget>("Budget", BudgetSchema);
