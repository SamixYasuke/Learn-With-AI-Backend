import { Router } from "express";
import { generateUserQuestionFromNoteController } from "../controllers/exam.controller";
import { authenticateJwt } from "../middlewares/authenticateJwt.middleware";

const router = Router();

router.post(
  "/exams/questions/generate-from-note/:note_id",
  authenticateJwt,
  generateUserQuestionFromNoteController
);

export default router;
