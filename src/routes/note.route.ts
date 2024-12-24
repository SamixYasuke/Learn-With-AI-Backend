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

router.get("/notes", authenticateJwt, getUserNotesController);

router.get("/notes/:note_id", authenticateJwt, getUserNoteByIdController);

router.post(
  "/notes/:note_id/ask",
  authenticateJwt,
  askAIQuestionBasedOnNoteController
);

router.get(
  "/notes/:note_id/conversations",
  authenticateJwt,
  getConversationsByNoteIdController
);

router.post(
  "/notes/upload",
  authenticateJwt,
  upload.single("note"),
  uploadUserNoteController
);

router.delete("/notes/:note_id", authenticateJwt, deleteUserNoteController);

export default router;
