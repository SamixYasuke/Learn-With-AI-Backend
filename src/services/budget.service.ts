import { CustomError } from "../errors/CustomError";
import { Budget, IBudget } from "../models/budget.model";
import mongoose from "mongoose";
import { splitIncome } from "../utils/helper";

const createBudgetService = async (
  user_id: string,
  budget_name: string,
  total_income: number
): Promise<object> => {
  if (!mongoose.Types.ObjectId.isValid(user_id)) {
    throw new CustomError("Invalid user ID", 400);
  }

  const { needs, savings, wants } = splitIncome(total_income);
  const budget = new Budget({
    budget_name,
    total_income,
    needs_budget: needs,
    savings_budget: savings,
    wants_budget: wants,
    user_id,
  });
  const savedBudget = await budget.save();
  return savedBudget;
};

const getAllBudgetsService = async (user_id: string): Promise<Object> => {
  if (!mongoose.Types.ObjectId.isValid(user_id)) {
    throw new CustomError("Invalid user ID", 400);
  }
  const budgets = await Budget.find({ user_id: user_id });
  return budgets;
};

export { createBudgetService, getAllBudgetsService };
