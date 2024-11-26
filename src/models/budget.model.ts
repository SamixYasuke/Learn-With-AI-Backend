import mongoose, { Schema, Document } from "mongoose";

export interface IBudget extends Document {
  budget_name: string;
  user_id: Schema.Types.ObjectId;
  total_income: number;
  needs_budget: number;
  wants_budget: number;
  savings_budget: number;
  month_year: string;
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
    month_year: {
      type: String,
      required: true,
      validate: {
        validator: function (v: string) {
          return /^\d{4}-(0[1-9]|1[0-2])$/.test(v); // Matches YYYY-MM
        },
        message: "month_year must be in the format YYYY-MM",
      },
    },
  },
  {
    timestamps: true,
  }
);

export const Budget = mongoose.model<IBudget>("Budget", BudgetSchema);
