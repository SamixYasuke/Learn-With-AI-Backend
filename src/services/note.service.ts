import { Note } from "../models/note.model";
import { CustomError } from "../errors/CustomError";
import { docToText } from "../utils/helper";
import { AuthenticatedRequest } from "../middlewares/authenticateJwt.middleware";
import { aiNoteChatResponse, aiNoteResponse } from "../utils/ai";
import fs from "fs";
import path from "path";
import { Conversation } from "../models";
import Question from "../models/question.model";

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
  const note = await Note.findById(note_id);

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
  await Question.deleteMany({ note_id });
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

  let conversation = await Conversation.findOne({ note_id: noteId });

  console.log(note.content);
  const aiResponse = await aiNoteChatResponse(userQuestion, note.content);

  if (!aiResponse || !aiResponse?.answer) {
    throw new CustomError(
      "Failed to generate AI response. Please try again.",
      500
    );
  }

  if (conversation) {
    conversation.conversations.push(
      { sender: "user", message: userQuestion },
      { sender: "ai", message: aiResponse.answer }
    );
    await conversation.save();
  } else {
    conversation = new Conversation({
      note_id: noteId,
      user_id: userId,
      conversations: [
        { sender: "user", message: userQuestion },
        { sender: "ai", message: aiResponse.answer },
      ],
    });
    note.conversation = conversation._id;
    await note.save();
    await conversation.save();
  }

  await Note.findByIdAndUpdate(noteId, {
    $push: { conversations: conversation._id },
  });

  return aiResponse;
};

const getConversationsByNoteIdService = async (
  userId: string,
  noteId: string
): Promise<object> => {
  const note = await Note.findOne({ _id: noteId, user_id: userId }).populate(
    "conversation"
  );

  if (!note) {
    throw new CustomError(
      "Note not found. Please ensure the note exists.",
      404
    );
  }

  const conversation_id = note?.conversation;
  const conversation = await Conversation.findOne({
    user_id: userId,
    note_id: noteId,
    _id: conversation_id,
  });

  return {
    note_id: noteId,
    conversation,
  };
};

export {
  getUserNotesService,
  getUserNoteByIdService,
  uploadUserNoteService,
  deleteUserNoteService,
  askAIQuestionBasedOnNoteService,
  getConversationsByNoteIdService,
};
