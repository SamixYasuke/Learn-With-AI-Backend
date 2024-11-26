import {
  createBudgetService,
  deleteBudgetService,
  getAllBudgets,
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
 * /api/v1/budget:
 *   post:
 *     summary: Create a new budget and delete the previous budgets
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
 *     description: Fetches all budgets associated with the authenticated user and calculates additional metrics, such as spent amounts, percentages, and balance status for needs, wants, and savings.
 *     tags:
 *       - Budgets
 *     security:
 *       - bearerAuth: []  # Correct capitalization for bearerAuth
 *     responses:
 *       200:
 *         description: Successfully retrieved budgets with detailed calculations.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Budgets retrieved successfully."
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: Unique identifier for the budget.
 *                         example: "6741f10ba3c7cc340fe76c6e"
 *                       budget_name:
 *                         type: string
 *                         description: Name of the budget.
 *                         example: "Monthly Budget"
 *                       user_id:
 *                         type: string
 *                         description: ID of the user associated with the budget.
 *                         example: "673e38ae9f6032cbf10e888b"
 *                       total_income:
 *                         type: number
 *                         description: Total income allocated for the budget.
 *                         example: 100000
 *                       needs_budget:
 *                         type: number
 *                         description: Budget allocated for needs.
 *                         example: 50000
 *                       wants_budget:
 *                         type: number
 *                         description: Budget allocated for wants.
 *                         example: 30000
 *                       savings_budget:
 *                         type: number
 *                         description: Budget allocated for savings.
 *                         example: 20000
 *                       needs_spent_amount:
 *                         type: number
 *                         description: Total amount spent on needs.
 *                         example: 25000
 *                       wants_spent_amount:
 *                         type: number
 *                         description: Total amount spent on wants.
 *                         example: 10000
 *                       savings_amount:
 *                         type: number
 *                         description: Total accumulated amount in savings.
 *                         example: 15000
 *                       needs_spent_percent:
 *                         type: number
 *                         description: Percentage of the needs budget that has been spent.
 *                         example: 50
 *                       wants_spent_percent:
 *                         type: number
 *                         description: Percentage of the wants budget that has been spent.
 *                         example: 33.33
 *                       savings_percentage:
 *                         type: number
 *                         description: Percentage of the savings budget achieved.
 *                         example: 75
 *                       is_needs_over_available_balance:
 *                         type: boolean
 *                         description: Indicates if the needs budget exceeds the available balance.
 *                         example: false
 *                       is_wants_over_available_balance:
 *                         type: boolean
 *                         description: Indicates if the wants budget exceeds the available balance.
 *                         example: false
 *                       is_savings_over_available_balance:
 *                         type: boolean
 *                         description: Indicates if the savings budget exceeds the available balance.
 *                         example: false
 *                       is_total_income_exceeded:
 *                         type: boolean
 *                         description: Indicates if the total expenses exceed the total income.
 *                         example: false
 *       401:
 *         description: Unauthorized. User is not authenticated.
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
 *                   example: "Unauthorized access."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: "Internal server error."
 */
const getAllBudgetsController = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const user_id = req.user.id;
    const budgets = await getAllBudgets(user_id);
    res.status(200).json({
      status_code: 200,
      message: "Budgets Retrieved Successfully",
      data: { budgets },
    });
  }
);

/**
 * @swagger
 * /api/v1/budgets:
 *   delete:
 *     summary: Delete all budgets for the authenticated user
 *     description: Deletes all budgets associated with the currently authenticated user.
 *     tags:
 *       - Budgets
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Budgets deleted successfully.
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
 *                   example: "Budget deleted successfully"
 *       400:
 *         description: Invalid user ID.
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
 *                   example: "Invalid user ID"
 *       404:
 *         description: No budgets found for the user.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: integer
 *                   example: 404
 *                 message:
 *                   type: string
 *                   example: "No budget found for the user"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */
const deleteBudgetController = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const user_id = req.user.id;
    const message = await deleteBudgetService(user_id);
    res.status(200).json({ status_code: 200, message });
  }
);

export {
  createBudgetController,
  getAllBudgetsController,
  deleteBudgetController,
};
