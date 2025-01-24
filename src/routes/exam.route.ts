import { Router } from "express";
import {
  generateUserQuestionFromNoteController,
  submitUserAnswersController,
  getGradedQuestionByIdController,
} from "../controllers/exam.controller";
import { authenticateJwt } from "../middlewares/authenticateJwt.middleware";

const router = Router();

router.post(
  "/questions/generate-from-note/:note_id",
  authenticateJwt,
  generateUserQuestionFromNoteController
);

router.post("/submit/:note_id", authenticateJwt, submitUserAnswersController);

router.get(
  "/graded/:question_id",
  authenticateJwt,
  getGradedQuestionByIdController
);

export default router;
