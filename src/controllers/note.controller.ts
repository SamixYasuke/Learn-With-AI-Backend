import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/authenticateJwt.middleware";
import { asyncHandler } from "../utils/asyncHandler";
import { uploadUserNoteService } from "../services/note.service";

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

export { uploadUserNoteController };
