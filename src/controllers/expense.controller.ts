import { Response, Request } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { CustomError } from "../errors/CustomError";
import {
  getExpensesService,
  createExpenseService,
  editExpenseService,
  categoriseExpensesService,
  getMonthlyExpensesService,
} from "../services/expense.service";

/**
 * @swagger
 * tags:
 *   name: Expenses
 *   description: Expense management APIs
 */
export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

/**
 * @swagger
 * /api/v1/expenses:
 *   get:
 *     summary: Get all expenses for the authenticated user
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully fetched expenses
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: number
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Expense'
 *       401:
 *         description: Unauthorized access
 */
const getExpensesController = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const user_id = req.user.id;
    const expenses = await getExpensesService(user_id);
    res.status(200).json({
      status_code: 200,
      message: "Expenses Fetched Successfully",
      data: expenses,
    });
  }
);

/**
 * @swagger
 * /api/v1/expenses:
 *   post:
 *     summary: Create a new expense
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - category_id
 *               - required_amount
 *               - accumulated_amount
 *             properties:
 *               name:
 *                 type: string
 *               category_id:
 *                 type: string
 *               required_amount:
 *                 type: number
 *               accumulated_amount:
 *                 type: number
 *     responses:
 *       201:
 *         description: Expense created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: number
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Expense'
 *       400:
 *         description: Invalid input data
 */
const createExpenseController = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { name, category_id, required_amount, accumulated_amount } = req.body;
    const user_id = req.user.id;
    if (!category_id || !required_amount || !accumulated_amount) {
      throw new CustomError("All fields are required!!", 400);
    }
    const expenseData = {
      name,
      category_id,
      required_amount,
      accumulated_amount,
      user_id,
    };
    const createExpense = await createExpenseService(expenseData);
    res.status(201).json({
      status_code: 201,
      message: "Expense Created Successfully",
      data: createExpense,
    });
  }
);

/**
 * @swagger
 * /api/v1/expenses/{id}:
 *   patch:
 *     summary: Edit an existing expense
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the expense to edit
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - accumulated_amount
 *             properties:
 *               accumulated_amount:
 *                 type: number
 *     responses:
 *       200:
 *         description: Successfully updated the expense
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: number
 *                 message:
 *                   type: string
 *       400:
 *         description: Invalid input data
 *       404:
 *         description: Expense not found
 *       403:
 *         description: Unauthorized to edit this expense
 */
const editExpenseController = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const user_id = req.user.id;
    const { accumulated_amount } = req.body;
    if (!id || !accumulated_amount) {
      throw new CustomError("All fields are required!!", 400);
    }
    const editExpenseResponse = await editExpenseService(
      id,
      accumulated_amount,
      user_id
    );
    res.status(200).json({
      status_code: 201,
      message: editExpenseResponse,
    });
  }
);

/**
 * @swagger
 * /api/v1/expenses/categories:
 *   get:
 *     summary: Get expenses grouped by categories
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully fetched categorised expenses
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: number
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       category_name:
 *                         type: string
 *                       total:
 *                         type: number
 *                       percentage:
 *                         type: string
 *                       total_expenses:
 *                         type: number
 *       400:
 *         description: Invalid user ID
 */
const categoriseExpensesController = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const user_id = req.user.id;
    const expensesCategory = await categoriseExpensesService(user_id);

    res.status(200).json({
      status_code: 200,
      message: "Expense Categories Fetched Successfully",
      data: expensesCategory,
    });
  }
);

/**
 * @swagger
 * /api/v1/expenses/summary:
 *   get:
 *     summary: Get monthly expenses for the authenticated user
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully fetched monthly expenses
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: number
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       year:
 *                         type: number
 *                       months:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             month:
 *                               type: number
 *                             daily:
 *                               type: array
 *                               items:
 *                                 type: object
 *                                 properties:
 *                                   day:
 *                                     type: number
 *                                   amount_spent:
 *                                     type: number
 *       400:
 *         description: Invalid user ID
 */
const getMonthlyExpensesController = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const user_id = req.user.id;
    const monthlyExpenses = await getMonthlyExpensesService(user_id);
    return res.status(200).json({
      status_code: 200,
      message: "Monthly Expenses Fetched Successfully",
      data: monthlyExpenses,
    });
  }
);

export {
  getExpensesController,
  createExpenseController,
  editExpenseController,
  categoriseExpensesController,
  getMonthlyExpensesController,
};
