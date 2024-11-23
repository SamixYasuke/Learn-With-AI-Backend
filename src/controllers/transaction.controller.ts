import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import {
  getTransactionsService,
  getTotalExpenseForUserService,
  getTotalIncomeForUserService,
  getAccountBalanceForUserService,
} from "../services/transaction.service";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

/**
 * @swagger
 * /transactions:
 *   get:
 *     summary: Get all transactions (expenses and incomes)
 *     description: Fetches all transactions (expenses and incomes) for the authenticated user with pagination.
 *     tags:
 *       - Transactions
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page.
 *     responses:
 *       200:
 *         description: Successfully fetched transactions.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: integer
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     transactions:
 *                       type: array
 *                       items:
 *                         type: object
 *                     totalItems:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *                     currentPage:
 *                       type: integer
 *                     pageSize:
 *                       type: integer
 *       400:
 *         description: Invalid pagination parameters.
 */
const getAllTransactionsController = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { page = 1, limit = 10 } = req.query;
    const user_id = req.user.id;
    const pageNumber = parseInt(page as string, 10);
    const pageSize = parseInt(limit as string, 10);

    if (
      isNaN(pageNumber) ||
      isNaN(pageSize) ||
      pageNumber < 1 ||
      pageSize < 1
    ) {
      res.status(400).json({ error: "Invalid pagination parameters" });
      return;
    }

    const data = await getTransactionsService(user_id, pageNumber, pageSize);

    res.status(200).json({
      status_code: 200,
      message: "Total Income Fetched successfully",
      data,
    });
  }
);

/**
 * @swagger
 * /transactions/income:
 *   get:
 *     summary: Get total income
 *     description: Fetches the total income for the authenticated user.
 *     tags:
 *       - Transactions
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully fetched total income.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: integer
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     user_id:
 *                       type: string
 *                     totalIncome:
 *                       type: number
 */
const getTotalIncomeForUserController = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const user_id = req.user.id;
    const totalIncome = await getTotalIncomeForUserService(user_id);

    res.status(200).json({
      status_code: 200,
      message: "Total Income Fetched successfully",
      data: { user_id, totalIncome },
    });
  }
);

/**
 * @swagger
 * /transactions/expense:
 *   get:
 *     summary: Get total expense
 *     description: Fetches the total expense for the authenticated user.
 *     tags:
 *       - Transactions
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully fetched total expense.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: integer
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     user_id:
 *                       type: string
 *                     totalExpense:
 *                       type: number
 */
const getTotalExpenseForUserController = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const user_id = req.user.id;
    const totalExpense = await getTotalExpenseForUserService(user_id);
    res.status(200).json({
      status_code: 200,
      message: "Total Expense Fetched successfully",
      data: { user_id, totalExpense },
    });
  }
);

/**
 * @swagger
 * /transactions/balance:
 *   get:
 *     summary: Get account balance
 *     description: Fetches the account balance (total income - total expense) for the authenticated user.
 *     tags:
 *       - Transactions
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully fetched account balance.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: integer
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     balance:
 *                       type: number
 */
const getAccountBalanceController = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const user_id = req.user?.id;
    const balance = await getAccountBalanceForUserService(user_id);

    res.status(200).json({
      status_code: 200,
      message: "Total Expense Fetched successfully",
      data: { balance },
    });
  }
);

export {
  getAllTransactionsController,
  getTotalIncomeForUserController,
  getTotalExpenseForUserController,
  getAccountBalanceController,
};
