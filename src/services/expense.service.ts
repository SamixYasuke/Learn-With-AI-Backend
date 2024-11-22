import { Expense, IExpense } from "../models/expense.model";
import { CustomError } from "../errors/CustomError";
import mongoose from "mongoose";

interface ExpenseData {
  category_id: string;
  required_amount: string;
  accumulated_amount: string;
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
  const expense = new Expense(expenseData);
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

  expenseData.accumulated_amount = accumulated_amount;
  await expenseData.save();
  return "Accumulated amount updated successfully";
};

export { getExpensesService, createExpenseService, editExpenseService };
