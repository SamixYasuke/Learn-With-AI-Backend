import { CustomError } from "../errors/CustomError";
import { Budget, IBudget } from "../models/budget.model";
import { Transaction } from "../models/transaction.model";
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

const getAllBudgets = async (userId: string) => {
  const budgets = await Budget.find({ user_id: userId });

  if (!budgets.length) {
    throw new Error("No budgets found for user.");
  }

  // Iterate through each budget to compute details
  const budgetDetails = await Promise.all(
    budgets.map(async (budget) => {
      const { needs_budget, wants_budget, savings_budget, total_income } =
        budget;

      // Calculate spent amounts
      const needsSpentAmount = await Transaction.aggregate([
        {
          $match: {
            user_id: budget.user_id,
            type: "expense",
            "category.priority_type": "need",
          },
        },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]).then((result) => result[0]?.total || 0);

      const wantsSpentAmount = await Transaction.aggregate([
        {
          $match: {
            user_id: budget.user_id,
            type: "expense",
            "category.priority_type": "want",
          },
        },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]).then((result) => result[0]?.total || 0);

      const savingsAmount = await Transaction.aggregate([
        {
          $match: {
            user_id: budget.user_id,
            type: "income",
            "category.priority_type": "saving",
          },
        },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]).then((result) => result[0]?.total || 0);

      // Calculate percentages
      const needsSpentPercent = parseFloat(
        ((needsSpentAmount / needs_budget) * 100).toFixed(2)
      );
      const wantsSpentPercent = parseFloat(
        ((wantsSpentAmount / wants_budget) * 100).toFixed(2)
      );
      const savingsPercent = parseFloat(
        ((savingsAmount / savings_budget) * 100).toFixed(2)
      );

      // Check if budgets are over their available balances
      const isNeedsOverAvailableBalance = needsSpentAmount > needs_budget;
      const isWantsOverAvailableBalance = wantsSpentAmount > wants_budget;
      const isSavingsOverAvailableBalance = savingsAmount > savings_budget;

      // Check if total income is exceeded
      const isTotalIncomeExceeded =
        needs_budget + wants_budget + savings_budget > total_income;

      return {
        _id: budget._id,
        budget_name: budget.budget_name,
        user_id: budget.user_id,
        total_income,
        needs_budget,
        wants_budget,
        savings_budget,
        needs_spent_amount: needsSpentAmount,
        wants_spent_amount: wantsSpentAmount,
        savings_amount: savingsAmount,
        needs_spent_percent: needsSpentPercent,
        wants_spent_percent: wantsSpentPercent,
        savings_percentage: savingsPercent,
        is_needs_over_available_balance: isNeedsOverAvailableBalance,
        is_wants_over_available_balance: isWantsOverAvailableBalance,
        is_savings_over_available_balance: isSavingsOverAvailableBalance,
        is_total_income_exceeded: isTotalIncomeExceeded,
      };
    })
  );

  return budgetDetails;
};

export { createBudgetService, getAllBudgets };
