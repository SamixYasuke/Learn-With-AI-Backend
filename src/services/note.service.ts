import { Note } from "../models/note.model";
import { CustomError } from "../errors/CustomError";
import { uploadToCloudinary } from "../utils/helper";
import { AuthenticatedRequest } from "../middlewares/authenticateJwt.middleware";
import aiNoteResponse from "../utils/ai";

const uploadUserNoteService = async (
  user_id: string,
  req: AuthenticatedRequest
): Promise<object> => {
  if (!req?.file) {
    throw new CustomError("No file provided for upload!", 400);
  }
  const uploadResult = await uploadToCloudinary(req.file.path);
  const newNote = new Note({
    user_id: user_id,
    title: req?.file?.originalname,
    fileUrl: uploadResult?.secure_url,
    fileType: req?.file?.mimetype,
  });
  const saveNote = await newNote.save();
  return {
    file: {
      originalName: req?.file?.originalname,
      path: req?.file?.path,
      cloudUrl: uploadResult?.secure_url,
    },
    note: saveNote,
  };
};

export { uploadUserNoteService };
