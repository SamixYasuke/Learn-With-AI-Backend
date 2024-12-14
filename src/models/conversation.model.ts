import mongoose, { Document, Schema, Types } from "mongoose";

export interface IConversation extends Document {
  note_id: Types.ObjectId;
  user_id: Types.ObjectId;
  conversations: Chat[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Chat {
  sender: "user" | "ai";
  message: string;
}

const Chat = new mongoose.Schema({
  sender: {
    type: String,
    enum: ["user", "ai"],
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
});

export const ConversationSchema = new mongoose.Schema(
  {
    note_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Note",
    },
    user_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    conversations: [Chat],
  },
  { timestamps: true }
);

const Conversation = mongoose.model<IConversation>(
  "Conversation",
  ConversationSchema
);

export default Conversation;
