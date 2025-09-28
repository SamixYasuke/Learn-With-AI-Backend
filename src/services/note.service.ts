import { Note } from "../models/note.model";
import { CustomError } from "../errors/CustomError";
import { docToText } from "../utils/helper";
import { AuthenticatedRequest } from "../middlewares/authenticateJwt.middleware";
import { aiNoteChatResponse, aiNoteResponse } from "../utils/ai";
import fs from "fs/promises";
import path from "path";
import { Conversation } from "../models";
import Question from "../models/question.model";
import { isValidObjectId } from "mongoose";
import { uploadDir } from "../config/multer.config";

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

  const { content, ...noteWithoutContent } = note.toObject();

  return noteWithoutContent;
};

const uploadUserNoteService = async (
  user_id: string,
  req: AuthenticatedRequest
) => {
  try {
    // Validate user_id
    if (!isValidObjectId(user_id)) {
      throw new CustomError("Invalid user ID", 400);
    }

    // Check if file exists
    if (!req?.file) {
      throw new CustomError("No file provided for upload!", 400);
    }

    // Use uploadDir for consistency
    const absoluteFilePath = path.join(uploadDir, req.file.filename);

    // Verify file is readable
    await fs.access(absoluteFilePath, fs.constants.R_OK);

    // Validate MIME type
    const allowedMimeTypes = [
      "application/pdf",
      "text/plain",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowedMimeTypes.includes(req.file.mimetype)) {
      await fs.unlink(absoluteFilePath); // Clean up
      throw new CustomError("Invalid file type", 400);
    }

    // Process file
    const docToTextResponse = await docToText(
      absoluteFilePath,
      req.file.mimetype
    );
    const aiNoteRes = await aiNoteResponse(docToTextResponse);

    // Validate AI response
    if (!aiNoteRes?.summary || !aiNoteRes?.explanations || !aiNoteRes?.topics) {
      await fs.unlink(absoluteFilePath); // Clean up
      throw new CustomError("Invalid AI response structure", 500);
    }

    // Save note to database
    const newNote = new Note({
      user_id,
      title: req.file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, ""), // Sanitize title
      fileType: req.file.mimetype,
      content: docToTextResponse,
      summary: aiNoteRes.summary,
      explanations: aiNoteRes.explanations.map((exp) => exp.explanation),
      topics: aiNoteRes.topics.map((topic) => topic.topic),
    });

    const saveNote = await newNote.save();

    return {
      note_id: saveNote._id.toString(),
      file: {
        original_name: req.file.originalname,
      },
      ai_note: aiNoteRes,
    };
  } catch (error: any) {
    // Clean up file on error
    const absoluteFilePath = req?.file
      ? path.join(uploadDir, req.file.filename)
      : null;
    if (
      absoluteFilePath &&
      (await fs.access(absoluteFilePath).catch(() => false))
    ) {
      await fs.unlink(absoluteFilePath);
    }
    console.error(`Error in uploadUserNoteService: ${error.message}`);
    throw error; // Rethrow for caller
  }
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

  const { note_id, user_id, ...cleaned_conversation } = conversation.toObject();

  return {
    note_id: noteId,
    conversations: cleaned_conversation,
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
