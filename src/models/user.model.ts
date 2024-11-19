import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  first_name: string;
  second_name: string;
  email: string;
  password: string;
  otp: string;
}

const UserSchema: Schema = new Schema(
  {
    first_name: {
      type: String,
      required: true,
    },
    second_name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    otp: {
      type: Number,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model<IUser>("User", UserSchema);
