import mongoose, { Document, Schema, Types } from "mongoose";

export interface IConversation extends Document {
  note_id: Types.ObjectId;
  sender: "user" | "ai";
  message: string;
  createdAt: Date;
  updatedAt: Date;
}

export const ConversationSchema = new mongoose.Schema(
  {
    note_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Note",
    },
    sender: {
      type: String,
      enum: ["user", "ai"],
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Conversation = mongoose.model<IConversation>(
  "Conversation",
  ConversationSchema
);

export default Conversation;
