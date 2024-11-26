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

  // Delete any existing budgets for the user
  await Budget.deleteMany({ user_id });

  // Split income into needs, savings, and wants
  const { needs, savings, wants } = splitIncome(total_income);

  // Create and save the new budget
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

  // Utility function for calculating percentages and flags
  const calculateSpentPercent = (
    spentAmount: number,
    budget: number
  ): { percent: number; isOver: boolean } => {
    const rawPercent = (spentAmount / budget) * 100;
    return {
      percent: rawPercent > 100 ? 100 : rawPercent, // Cap at 100%
      isOver: rawPercent > 100, // Flag if exceeds 100%
    };
  };

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

    // Calculate percentages and flags
    const { percent: needsSpentPercent, isOver: isNeedsOverAvailableBalance } =
      calculateSpentPercent(needsSpentAmount, budget.needs_budget);
    const { percent: wantsSpentPercent, isOver: isWantsOverAvailableBalance } =
      calculateSpentPercent(wantsSpentAmount, budget.wants_budget);
    const savingsPercentage =
      (totalAccumulatedSavings / budget.savings_budget) * 100 || 0;

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
      is_savings_over_available_balance:
        totalAccumulatedSavings > budget.savings_budget,
      is_total_income_exceeded: isTotalIncomeExceeded,
    };
  });

  return budgetData;
};

const deleteBudgetService = async (user_id: string): Promise<string> => {
  if (!mongoose.Types.ObjectId.isValid(user_id)) {
    throw new CustomError("Invalid user ID", 400);
  }

  const result = await Budget.deleteMany({ user_id });

  if (result.deletedCount === 0) {
    throw new CustomError("No budget found for the user", 404);
  }

  return "Budget deleted successfully";
};

export { createBudgetService, getAllBudgets, deleteBudgetService };
