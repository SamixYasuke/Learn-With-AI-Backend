import mongoose, { Schema, Document, Types } from "mongoose";

export interface INote extends Document {
  user_id: Types.ObjectId;
  fileType: string;
  title: string;
  content: string;
  summary: string;
  topics: object[];
  conversations: any;
  createdAt: Date;
  updatedAt: Date;
}

const NoteSchema: Schema = new Schema<INote>(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    fileType: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
    },
    summary: {
      type: String,
    },
    topics: [Object],
    conversations: [
      {
        type: Schema.Types.ObjectId,
        ref: "Conversation",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Note = mongoose.model<INote>("Note", NoteSchema);
