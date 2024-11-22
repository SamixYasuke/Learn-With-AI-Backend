import mongoose, { Schema, Document, Mongoose } from "mongoose";

export interface IExpense extends Document {
  user: Schema.Types.ObjectId;
  amount: Number;
  category_id: Schema.Types.ObjectId;
}

const ExpenseSchema: Schema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    amount: {
      type: Number,
      required: true,
    },
    category_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Category",
    },
  },
  {
    timestamps: true,
  }
);

export const Expense = mongoose.model<IExpense>("Expense", ExpenseSchema);
