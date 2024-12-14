import { Note } from "../models/note.model";
import { CustomError } from "../errors/CustomError";
import { docToText } from "../utils/helper";
import { AuthenticatedRequest } from "../middlewares/authenticateJwt.middleware";
import { aiNoteChatResponse, aiNoteResponse } from "../utils/ai";
import fs from "fs";
import path from "path";
import { Conversation } from "../models";

const getUserNotesService = async (user_id: string): Promise<object> => {
  const notes = await Note.find({ user_id });

  if (notes.length === 0) {
    return [];
  }

  const note_data = notes.map((note) => ({
    id: note?._id,
    note_name: note.title,
  }));
  return note_data;
};

const getUserNoteByIdService = async (
  user_id: string,
  note_id: string
): Promise<object> => {
  const note = await Note.findById(note_id, { user_id });

  if (!note) {
    throw new CustomError("Note not found", 404);
  }

  if (note?.user_id.toString() !== user_id) {
    throw new CustomError("Unauthorized access to this note", 403);
  }

  return note;
};

const uploadUserNoteService = async (
  user_id: string,
  req: AuthenticatedRequest
): Promise<object> => {
  if (!req?.file) {
    throw new CustomError("No file provided for upload!", 400);
  }

  const absoluteFilePath = path.resolve(
    req.file.destination,
    req.file.filename
  );

  if (!fs.existsSync(absoluteFilePath)) {
    throw new CustomError(`File not found at path: ${absoluteFilePath}`, 404);
  }

  const docToTextResponse = await docToText(
    absoluteFilePath,
    req.file.mimetype
  );
  const aiNoteRes = await aiNoteResponse(docToTextResponse);
  const newNote = new Note({
    user_id: user_id,
    title: req?.file?.originalname,
    fileType: req?.file?.mimetype,
    content: docToTextResponse,
    summary: aiNoteRes?.summary,
    topics: aiNoteRes?.topics.map((topic) => topic?.topic),
  });
  const saveNote = await newNote.save();

  return {
    file: {
      original_name: req?.file?.originalname,
    },
    note: saveNote,
    ai_note: aiNoteRes,
  };
};

const deleteUserNoteService = async (
  user_id: string,
  note_id: string
): Promise<object> => {
  const note = await Note.findOne({ _id: note_id, user_id });

  if (!note) {
    throw new CustomError("Note not found", 404);
  }

  if (note?.user_id.toString() !== user_id) {
    throw new CustomError("Unauthorized access to this note", 403);
  }

  await Conversation.deleteMany({ note_id });
  await note.deleteOne();

  return { note_id };
};

const askAIQuestionBasedOnNoteService = async (
  userId: string,
  userQuestion: string,
  noteId: string
): Promise<object> => {
  if (!userQuestion) {
    throw new CustomError(
      "No question provided. Please provide a valid question.",
      400
    );
  }

  const note = await Note.findOne({ _id: noteId, user_id: userId });
  if (!note) {
    throw new CustomError(
      "Note not found. Please ensure the note exists.",
      404
    );
  }

  const noteContext = note?.content;
  const aiResponse = await aiNoteChatResponse(userQuestion, noteContext);

  if (!aiResponse || !aiResponse?.question || !aiResponse?.answer) {
    throw new CustomError(
      "Failed to generate AI response. Please try again.",
      500
    );
  }

  const userConversation = new Conversation({
    sender: "user",
    message: userQuestion,
    note_id: noteId,
  });

  const aiConversation = new Conversation({
    sender: "ai",
    message: aiResponse.answer,
    note_id: noteId,
  });

  const [savedUserConversation, savedAIConversation] = await Promise.all([
    userConversation.save(),
    aiConversation.save(),
  ]);

  await Note.findByIdAndUpdate(noteId, {
    $push: {
      conversations: [savedUserConversation._id, savedAIConversation._id],
    },
  });

  return aiResponse;
};

const getConversationsByNoteIdService = async (
  userId: string,
  noteId: string
): Promise<object> => {
  const note = await Note.findOne({ _id: noteId, user_id: userId }).populate(
    "conversations"
  );

  if (!note) {
    throw new CustomError(
      "Note not found. Please ensure the note exists.",
      404
    );
  }

  if (note?.conversations?.length === 0) {
    return [];
  }

  const conversationsResponse = note.conversations.map((conversation: any) => ({
    id: conversation?._id,
    sender: conversation?.sender,
    message: conversation?.message,
  }));

  return { note_id: noteId, conversations: conversationsResponse };
};

export {
  getUserNotesService,
  getUserNoteByIdService,
  uploadUserNoteService,
  deleteUserNoteService,
  askAIQuestionBasedOnNoteService,
  getConversationsByNoteIdService,
};
