import mongoose, { Schema, Document, Types } from "mongoose";

export interface INote extends Document {
  user_id: Types.ObjectId;
  title: string;
  fileUrl: string;
  fileType: string;
  summary: string;
  topics: string[];
  createdAt: Date;
  updatedAt: Date;
}

const NoteSchema: Schema = new Schema<INote>(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    fileType: {
      type: String,
      required: true,
    },
    summary: {
      type: String,
    },
    topics: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

export const Note = mongoose.model<INote>("Note", NoteSchema);
