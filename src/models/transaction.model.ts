import mongoose, { Schema, Document } from "mongoose";

export interface ITransaction extends Document {
  user_id: Schema.Types.ObjectId;
  name: string;
  amount: string;
  type: string;
  category: Schema.Types.ObjectId;
  percentage: number;
}

const TransactionSchema: Schema = new Schema(
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
    amount: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["expense", "income"],
      default: "expense",
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    percentage: {
      type: Number,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Transaction = mongoose.model<ITransaction>(
  "Transaction",
  TransactionSchema
);
