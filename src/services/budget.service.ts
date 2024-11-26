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
): Promise<IBudget> => {
  if (!mongoose.Types.ObjectId.isValid(user_id)) {
    throw new CustomError("Invalid user ID", 400);
  }

  const { needs, savings, wants } = splitIncome(total_income);

  // Get the current month and year
  const now = new Date();
  const month_year = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`; // Format: YYYY-MM

  // Delete all previous budgets
  await Budget.deleteMany({ user_id });

  // Check if a budget already exists for this month (optional, as we're deleting all budgets above)
  const existingBudget = await Budget.findOne({ user_id, month_year });

  if (existingBudget) {
    // Update the existing budget
    existingBudget.budget_name = budget_name;
    existingBudget.total_income = total_income;
    existingBudget.needs_budget = needs;
    existingBudget.wants_budget = wants;
    existingBudget.savings_budget = savings;
    await existingBudget.save();
    return existingBudget;
  }

  // Create a new budget
  const newBudget = new Budget({
    user_id,
    budget_name,
    total_income,
    needs_budget: needs,
    wants_budget: wants,
    savings_budget: savings,
    month_year,
  });
  return await newBudget.save();
};

const getAllBudgets = async (userId: string) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new CustomError("Invalid user ID", 400);
  }

  // Fetch the user's budget
  const budget = await Budget.findOne({ user_id: userId });

  if (!budget) {
    return null;
  }

  // Define the current month's date range
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  // Fetch current month's transactions and goals for the user
  const transactions = await Transaction.find({
    user_id: userId,
    type: "expense",
    createdAt: { $gte: startOfMonth, $lte: endOfMonth },
  }).populate("category");

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

  // Filter transactions by priority type
  const needsTransactions = transactions.filter(
    (transaction) => transaction.category.priority_type === "need"
  );
  const wantsTransactions = transactions.filter(
    (transaction) => transaction.category.priority_type === "want"
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
  const savingsPercentage = Math.min(
    (totalAccumulatedSavings / budget.savings_budget) * 100,
    100
  );

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
