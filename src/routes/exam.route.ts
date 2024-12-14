import { Router } from "express";
import {
  generateUserQuestionFromNoteController,
  submitUserAnswersController,
} from "../controllers/exam.controller";
import { authenticateJwt } from "../middlewares/authenticateJwt.middleware";

const router = Router();

router.post(
  "/exams/questions/generate-from-note/:note_id",
  authenticateJwt,
  generateUserQuestionFromNoteController
);

router.post(
  "/exams/submit/:note_id",
  authenticateJwt,
  submitUserAnswersController
);

export default router;
