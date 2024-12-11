import mongoose, { Schema, Document, Types } from "mongoose";

interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  google_id?: string;
  avatar?: string;
  profile?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
    },
    google_id: {
      type: String,
    },
    avatar: {
      type: String,
    },
    profile: {
      type: Schema.Types.ObjectId,
      ref: "Profile",
    },
  },
  { timestamps: true }
);

const User = mongoose.model<IUser>("User", UserSchema);

export default User;
