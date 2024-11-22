import { Response, Request } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { CustomError } from "../errors/CustomError";
import {
  getExpensesService,
  createExpenseService,
  editExpenseService,
} from "../services/expense.service";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

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

const createExpenseController = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { category_id, required_amount, accumulated_amount } = req.body;
    const user_id = req.user.id;
    if (!category_id || !required_amount || !accumulated_amount) {
      throw new CustomError("All fields are required!!", 400);
    }
    const expenseData = {
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

export {
  getExpensesController,
  createExpenseController,
  editExpenseController,
};
