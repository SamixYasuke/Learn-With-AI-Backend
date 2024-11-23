import {
  createBudgetService,
  getAllBudgetsService,
} from "../services/budget.service";
import { asyncHandler } from "../utils/asyncHandler";
import { Request, Response } from "express";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

/**
 * @swagger
 * /api/v1/budgets:
 *   post:
 *     summary: Create a new budget
 *     description: Allows an authenticated user to create a budget by specifying the budget name and total income. The income is split into needs, wants, and savings.
 *     tags:
 *       - Budgets
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               budget_name:
 *                 type: string
 *                 example: Monthly Budget
 *                 description: Name of the budget
 *               total_income:
 *                 type: number
 *                 example: 5000
 *                 description: Total income for the budget
 *     responses:
 *       201:
 *         description: Budget created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: integer
 *                   example: 201
 *                 message:
 *                   type: string
 *                   example: Budget Created Successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 64ae5f3e3d0c4a3a1b9c92ac
 *                     user_id:
 *                       type: string
 *                       example: 64ae5f3e3d0c4a3a1b9c92ab
 *                     budget_name:
 *                       type: string
 *                       example: Monthly Budget
 *                     total_income:
 *                       type: number
 *                       example: 5000
 *                     needs_budget:
 *                       type: number
 *                       example: 2500
 *                     savings_budget:
 *                       type: number
 *                       example: 1000
 *                     wants_budget:
 *                       type: number
 *                       example: 1500
 *                     createdAt:
 *                       type: string
 *                       example: 2024-11-23T15:30:00.000Z
 *                     updatedAt:
 *                       type: string
 *                       example: 2024-11-23T15:30:00.000Z
 *       400:
 *         description: Bad Request - Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: Invalid user ID
 *       500:
 *         description: Internal Server Error
 */
const createBudgetController = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const user_id = req.user.id;
    const { budget_name, total_income } = req.body;
    const budgetResponse = await createBudgetService(
      user_id,
      budget_name,
      total_income
    );
    res.status(201).json({
      status_code: 201,
      message: "Budget Created Successfully",
      data: budgetResponse,
    });
  }
);

/**
 * @swagger
 * /api/v1/budgets:
 *   get:
 *     summary: Retrieve all budgets for the authenticated user
 *     description: Fetches all budgets associated with the currently authenticated user.
 *     tags:
 *       - Budgets
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved budgets.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Budgets Retrieved Successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     budgets:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Budget'
 *       400:
 *         description: Invalid user ID or bad request.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: Invalid user ID
 *       401:
 *         description: Unauthorized. No valid token provided.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: integer
 *                   example: 401
 *                 message:
 *                   type: string
 *                   example: Unauthorized
 */
const getAllBudgetsController = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const user_id = req.user.id;
    const budgets = await getAllBudgetsService(user_id);
    res.status(200).json({
      status_code: 200,
      message: "Budgets Retrieved Successfully",
      data: { budgets },
    });
  }
);

export { createBudgetController, getAllBudgetsController };
