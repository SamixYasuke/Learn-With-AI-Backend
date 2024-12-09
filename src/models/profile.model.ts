import mongoose, { Schema, Document, Types } from "mongoose";

interface IProfile extends Document {
  user: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ProfileSchema = new Schema<IProfile>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Profile = mongoose.model<IProfile>("Profile", ProfileSchema);

export default Profile;
