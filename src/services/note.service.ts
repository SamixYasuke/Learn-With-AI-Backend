import { Note } from "../models/note.model";
import { CustomError } from "../errors/CustomError";
import { uploadToCloudinary, docToText } from "../utils/helper";
import { AuthenticatedRequest } from "../middlewares/authenticateJwt.middleware";
import aiNoteResponse from "../utils/ai";
import fs from "fs";
import path from "path";

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

export { uploadUserNoteService };
