import { Note } from "../models/note.model";
import { CustomError } from "../errors/CustomError";
import { uploadToCloudinary, docToText } from "../utils/helper";
import { AuthenticatedRequest } from "../middlewares/authenticateJwt.middleware";
import aiNoteResponse from "../utils/ai";
import fs from "fs";
import path from "path";

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
    throw new CustomError("This note doesn't belong to this user", 403);
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
  const uploadResult = await uploadToCloudinary(req.file.path);
  const newNote = new Note({
    user_id: user_id,
    title: req?.file?.originalname,
    fileUrl: uploadResult?.secure_url,
    fileType: req?.file?.mimetype,
    summary: aiNoteRes?.summary,
    topics: aiNoteRes?.topics.map((topic) => topic?.topic),
  });
  const saveNote = await newNote.save();

  return {
    file: {
      original_name: req?.file?.originalname,
      path: req?.file?.path,
      cloud_url: uploadResult?.secure_url,
    },
    note: saveNote,
    ai_note: aiNoteRes,
  };
};

const deleteUserNoteService = async (
  user_id: string,
  note_id: string
): Promise<object> => {
  const note = await Note.findOne({ _id: note_id });

  if (!note) {
    throw new CustomError("Note not found", 404);
  }

  if (note.user_id.toString() !== user_id) {
    throw new CustomError(
      "This note can't be deleted as it doesn't belong to this user",
      403
    );
  }

  await note.deleteOne();
  return { note_id };
};

export {
  getUserNotesService,
  getUserNoteByIdService,
  uploadUserNoteService,
  deleteUserNoteService,
};
