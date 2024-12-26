import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/authenticateJwt.middleware";
import {
  generateUserQuestionFromNoteService,
  submitUserAnswersService,
  getGradedQuestionByIdService,
} from "../services/exam.service";
import { asyncHandler } from "../utils/asyncHandler";

/**
 * @swagger
 * /api/v1/notes/{note_id}/generate-questions:
 *   post:
 *     summary: Generate questions from a user note
 *     tags:
 *       - Notes
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: note_id
 *         required: true
 *         schema:
 *           type: string
 *           example: 64c7f1bc2e9a4e12f89a1234
 *         description: The ID of the note to generate questions from
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - question_type
 *               - number_of_questions
 *               - difficulty
 *             properties:
 *               question_type:
 *                 type: string
 *                 enum: [multiple_choice, true_false]
 *                 example: multiple_choice
 *               number_of_questions:
 *                 type: integer
 *                 enum: [5, 10]
 *                 example: 5
 *               difficulty:
 *                 type: string
 *                 enum: [easy, medium, hard]
 *                 example: medium
 *     responses:
 *       201:
 *         description: Questions successfully generated and saved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Questions successfully generated and saved.
 *                 data:
 *                   type: object
 *                   properties:
 *                     note_id:
 *                       type: string
 *                       example: 64c7f1bc2e9a4e12f89a1234
 *                     question_type:
 *                       type: string
 *                       example: multiple_choice
 *                     number_of_questions:
 *                       type: integer
 *                       example: 5
 *                     difficulty:
 *                       type: string
 *                       example: medium
 *                     questions:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           question_text:
 *                             type: string
 *                             example: What is the capital of France?
 *                           options:
 *                             type: array
 *                             items:
 *                               type: string
 *                             example: ["Paris", "London", "Berlin", "Rome"]
 *                           correct_answer:
 *                             type: string
 *                             example: Paris
 *                           expected_answer:
 *                             type: string
 *                             example: Paris
 *       400:
 *         description: Validation error or questions already generated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Questions already generated for this note.
 *       404:
 *         description: Note not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: |
 *                     Question generation failed: Note not found.
 *       500:
 *         description: Server error during question generation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: |
 *                     Question generation failed: AI response invalid.
 */
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

/**
 * @swagger
 * /api/v1/notes/{note_id}/submit-answers:
 *   post:
 *     summary: Submit user answers for grading
 *     tags:
 *       - Notes
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: note_id
 *         required: true
 *         schema:
 *           type: string
 *           example: 64c7f1bc2e9a4e12f89a1234
 *         description: The ID of the note for which answers are being submitted
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - answers
 *             properties:
 *               answers:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     question:
 *                       type: string
 *                       example: What is the capital of France?
 *                     answer:
 *                       type: string
 *                       example: Paris
 *     responses:
 *       201:
 *         description: Answers graded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Answers graded successfully!
 *                 data:
 *                   type: object
 *                   properties:
 *                     grade_info:
 *                       type: object
 *                       properties:
 *                         number_of_questions:
 *                           type: integer
 *                           example: 5
 *                         grade:
 *                           type: string
 *                           example: A
 *                         score:
 *                           type: integer
 *                           example: 90
 *                         calculation_basis:
 *                           type: string
 *                           example: 4/5
 *       400:
 *         description: Validation error or question already graded
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Answers cannot be an empty array
 *       404:
 *         description: Note or question not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Note not found!
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: An unexpected error occurred.
 */
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

/**
 * @swagger
 * /api/v1/questions/{question_id}/graded:
 *   get:
 *     summary: Get a graded question by ID
 *     tags:
 *       - Questions
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: question_id
 *         required: true
 *         schema:
 *           type: string
 *           example: 64c7f1bc2e9a4e12f89a5678
 *         description: The ID of the graded question to retrieve
 *     responses:
 *       201:
 *         description: Graded question retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Graded Question Retrieved successfully!
 *                 data:
 *                   type: object
 *                   properties:
 *                     question:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                           example: 64c7f1bc2e9a4e12f89a5678
 *                         user_id:
 *                           type: string
 *                           example: 64c7f1bc2e9a4e12f89a1234
 *                         note_id:
 *                           type: string
 *                           example: 64c7f1bc2e9a4e12f89a5678
 *                         question_type:
 *                           type: string
 *                           example: multiple_choice
 *                         number_of_questions:
 *                           type: integer
 *                           example: 5
 *                         difficulty:
 *                           type: string
 *                           example: medium
 *                         is_graded:
 *                           type: boolean
 *                           example: true
 *                         grade:
 *                           type: string
 *                           example: A
 *                         score:
 *                           type: integer
 *                           example: 90
 *                         calculation_basis:
 *                           type: string
 *                           example: 4/5
 *       404:
 *         description: Graded question not found or doesn't belong to the user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Graded question not found or doesn't belong to the user!
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: An unexpected error occurred.
 */
const getGradedQuestionByIdController = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const user_id = req?.user?.id;
    const { question_id } = req?.params;

    const questionById = await getGradedQuestionByIdService(
      user_id,
      question_id
    );

    res.status(201).json({
      message: "Graded Question Retrieved successfully!",
      data: questionById,
    });
  }
);

export {
  generateUserQuestionFromNoteController,
  submitUserAnswersController,
  getGradedQuestionByIdController,
};
