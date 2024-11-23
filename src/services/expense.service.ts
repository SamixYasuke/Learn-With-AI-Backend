import { Expense, IExpense } from "../models/expense.model";
import { CustomError } from "../errors/CustomError";
import mongoose from "mongoose";
import { getTotalExpenseForUserService } from "./transaction.service";
import {
  calculateCategoryPercentage,
  calculateCategoryTotals,
} from "../utils/helper";

interface ExpenseData {
  name: string;
  category_id: string;
  required_amount: number;
  accumulated_amount: number;
  user_id: string;
}

const getExpensesService = async (user_id: string): Promise<any[]> => {
  if (!mongoose.Types.ObjectId.isValid(user_id)) {
    throw new CustomError("Invalid user ID", 400);
  }

  const expenses = await Expense.find({ user_id: user_id }).populate(
    "category_id"
  );
  return expenses;
};

const createExpenseService = async (
  expenseData: ExpenseData
): Promise<IExpense> => {
  const { accumulated_amount, required_amount } = expenseData;

  if (required_amount <= 0) {
    throw new CustomError("Required amount must be greater than 0", 400);
  }

  if (accumulated_amount > required_amount) {
    throw new CustomError(
      "Accumulated amount cannot be greater than the required amount",
      400
    );
  }

  const expense_percentage = (accumulated_amount / required_amount) * 100;
  const expense = new Expense(expenseData);
  expense.expense_percentage = expense_percentage;
  const savedExpense = await expense.save();
  return savedExpense;
};

const editExpenseService = async (
  expense_id: string,
  accumulated_amount: number,
  user_id: string
): Promise<string> => {
  if (!mongoose.Types.ObjectId.isValid(expense_id)) {
    throw new CustomError("Invalid expense ID", 400);
  }

  const expenseData = await Expense.findById(expense_id);
  if (!expenseData) {
    throw new CustomError("Expense data not found", 404);
  }

  if (user_id !== expenseData.user_id.toString()) {
    throw new CustomError(
      "User doesn't have the right to update this expense",
      403
    );
  }
  if (accumulated_amount > expenseData.required_amount) {
    throw new CustomError(
      "Accumulated amount cannot be greater than the required amount",
      400
    );
  }

  const expense_percentage =
    (accumulated_amount / expenseData.required_amount) * 100;
  expenseData.accumulated_amount = accumulated_amount;
  expenseData.expense_percentage = expense_percentage;
  await expenseData.save();

  return "Accumulated amount and percentage updated successfully";
};

const categoriseExpensesService = async (user_id: any): Promise<any> => {
  if (!mongoose.Types.ObjectId.isValid(user_id)) {
    throw new CustomError("Invalid user ID", 400);
  }

  const expenses = await Expense.find({ user_id }).populate("category_id");
  const total_expenses = await getTotalExpenseForUserService(user_id);
  const categorised = expenses.reduce((result: any, item: any) => {
    const categoryName = item.category_id.category_name;
    if (!result[categoryName]) {
      result[categoryName] = [];
    }
    result[categoryName].push(item);
    return result;
  }, {});

  const totals = calculateCategoryTotals(categorised);
  const percentages = calculateCategoryPercentage(totals, total_expenses);

  const data = Object.entries(totals).map(([category, total]) => ({
    category_name: category,
    percentage: percentages[category],
    total,
    total_expenses,
  }));

  return data;
};

export {
  getExpensesService,
  createExpenseService,
  editExpenseService,
  categoriseExpensesService,
};
