import mongoose, { Schema, Document } from "mongoose";

export interface INote extends Document {
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
      enum: ["PDF", "DOCX", "TXT"],
      required: true,
    },
    summary: {
      type: String,
      required: true,
    },
    topics: {
      type: [String],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Note = mongoose.model<INote>("Note", NoteSchema);
