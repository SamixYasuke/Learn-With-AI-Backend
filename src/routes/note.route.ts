import upload from "../config/multer.config";
import { Router } from "express";
import { authenticateJwt } from "../middlewares/authenticateJwt.middleware";
import {
  getUserNotesController,
  getUserNoteByIdController,
  uploadUserNoteController,
  deleteUserNoteController,
  askAIQuestionBasedOnNoteController,
  getConversationsByNoteIdController,
} from "../controllers/note.controller";

const router = Router();

router.get("/", authenticateJwt, getUserNotesController);

router.get("/:note_id", authenticateJwt, getUserNoteByIdController);

router.post(
  "/:note_id/ask",
  authenticateJwt,
  askAIQuestionBasedOnNoteController
);

router.get(
  "/:note_id/conversations",
  authenticateJwt,
  getConversationsByNoteIdController
);

router.post(
  "/upload",
  authenticateJwt,
  upload.single("note"),
  uploadUserNoteController
);

router.delete("/:note_id", authenticateJwt, deleteUserNoteController);

export default router;
