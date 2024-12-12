import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/authenticateJwt.middleware";
import { asyncHandler } from "../utils/asyncHandler";
import {
  getUserNotesService,
  getUserNoteByIdService,
  uploadUserNoteService,
  deleteUserNoteService,
} from "../services/note.service";

const getUserNotesController = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const user_id = req?.user?.id;
    const getUserNotesRes = await getUserNotesService(user_id);
    res.status(200).json({
      message: "Notes retrieved successfully!",
      data: {
        notes: getUserNotesRes,
      },
    });
  }
);

const getUserNoteByIdController = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const user_id = req?.user?.id;
    const { note_id } = req?.params;
    const getUserNoteRes = await getUserNoteByIdService(user_id, note_id);
    res.status(200).json({
      message: "Notes retrieved successfully!",
      data: {
        note: getUserNoteRes,
      },
    });
  }
);

const uploadUserNoteController = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const user_id = req?.user?.id;
    const upload = await uploadUserNoteService(user_id, req);
    res.status(200).json({
      message: "File uploaded successfully!",
      upload,
    });
  }
);

const deleteUserNoteController = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const user_id = req?.user?.id;
    const { note_id } = req?.params;
    const deleteNoteRes = await deleteUserNoteService(user_id, note_id);
    res.status(200).json({
      message: "Note Deleted successfully!",
      data: deleteNoteRes,
    });
  }
);

export {
  getUserNotesController,
  getUserNoteByIdController,
  uploadUserNoteController,
  deleteUserNoteController,
};
