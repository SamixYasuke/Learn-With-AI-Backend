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
