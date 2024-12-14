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

router.get("/note", authenticateJwt, getUserNotesController);

router.get("/note/:note_id", authenticateJwt, getUserNoteByIdController);

router.post(
  "/note/:note_id/ask",
  authenticateJwt,
  askAIQuestionBasedOnNoteController
);

router.get(
  "/note/:note_id/questions",
  authenticateJwt,
  getConversationsByNoteIdController
);

router.post(
  "/note/upload",
  authenticateJwt,
  upload.single("note"),
  uploadUserNoteController
);

router.delete("/note/:note_id", authenticateJwt, deleteUserNoteController);

export default router;
