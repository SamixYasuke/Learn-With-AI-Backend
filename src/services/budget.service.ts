import { CustomError } from "../errors/CustomError";
import { Budget, IBudget } from "../models/budget.model";
import mongoose from "mongoose";
import { Category } from "../models/category.model";
import { Goal } from "../models/goal.model";
import { Transaction } from "../models/transaction.model";
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
  // Fetch all budgets for the user
  const budgets = await Budget.find({ user_id: userId });

  if (!budgets || budgets.length === 0) {
    return { data: [], message: "No budgets found." };
  }

  // Fetch all transactions and goals for the user
  const transactions = await Transaction.find({ user_id: userId }).populate(
    "category"
  );
  const goals = await Goal.find({ user_id: userId });

  // Calculate savings amount
  const totalAccumulatedSavings = goals.reduce(
    (acc, goal) => acc + goal.accumulated_amount,
    0
  );

  // Process budgets
  const budgetData = budgets.map((budget) => {
    // Filter transactions for the budget
    const needsTransactions = transactions.filter(
      (transaction) =>
        transaction.type === "expense" &&
        transaction.category.priority_type === "need"
    );
    const wantsTransactions = transactions.filter(
      (transaction) =>
        transaction.type === "expense" &&
        transaction.category.priority_type === "want"
    );

    // Calculate spent amounts
    const needsSpentAmount = needsTransactions.reduce(
      (acc, transaction) => acc + parseFloat(transaction.amount),
      0
    );
    const wantsSpentAmount = wantsTransactions.reduce(
      (acc, transaction) => acc + parseFloat(transaction.amount),
      0
    );

    // Calculate percentages
    const needsSpentPercent =
      (needsSpentAmount / budget.needs_budget) * 100 || 0;
    const wantsSpentPercent =
      (wantsSpentAmount / budget.wants_budget) * 100 || 0;
    const savingsPercentage =
      (totalAccumulatedSavings / budget.savings_budget) * 100 || 0;

    // Check if budgets are exceeded
    const isNeedsOverAvailableBalance = needsSpentAmount > budget.needs_budget;
    const isWantsOverAvailableBalance = wantsSpentAmount > budget.wants_budget;
    const isSavingsOverAvailableBalance =
      totalAccumulatedSavings > budget.savings_budget;

    // Check if total income is exceeded
    const totalExpenses = needsSpentAmount + wantsSpentAmount;
    const isTotalIncomeExceeded = totalExpenses > budget.total_income;

    return {
      ...budget.toObject(),
      needs_spent_amount: needsSpentAmount,
      wants_spent_amount: wantsSpentAmount,
      savings_amount: totalAccumulatedSavings,
      needs_spent_percent: needsSpentPercent,
      wants_spent_percent: wantsSpentPercent,
      savings_percentage: savingsPercentage,
      is_needs_over_available_balance: isNeedsOverAvailableBalance,
      is_wants_over_available_balance: isWantsOverAvailableBalance,
      is_savings_over_available_balance: isSavingsOverAvailableBalance,
      is_total_income_exceeded: isTotalIncomeExceeded,
    };
  });

  return budgetData;
};

export { createBudgetService, getAllBudgets };
