import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/authenticateJwt.middleware";
import {
  generateUserQuestionFromNoteService,
  submitUserAnswersService,
} from "../services/exam.service";
import { asyncHandler } from "../utils/asyncHandler";

const generateUserQuestionFromNoteController = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const user_id = req?.user?.id;
    const { note_id } = req?.params;
    const { question_type, number_of_questions, difficulty } = req?.body;
    const generatedQuestions = await generateUserQuestionFromNoteService(
      user_id,
      note_id,
      question_type,
      number_of_questions,
      difficulty
    );

    res.status(201).json({
      message: "Questions successfully generated and saved.",
      data: generatedQuestions,
    });
  }
);

const submitUserAnswersController = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const user_id = req?.user?.id;
    const { note_id } = req?.params;

    const { answers } = req?.body;

    const gradeResponse = await submitUserAnswersService(
      user_id,
      note_id,
      answers
    );

    res.status(201).json({
      message: "Answers graded successfully!",
      data: gradeResponse,
    });
  }
);

export { generateUserQuestionFromNoteController, submitUserAnswersController };
