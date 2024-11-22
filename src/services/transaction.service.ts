import { Expense } from "../models/expense.model";
import { Income } from "../models/income.model";
import { CustomError } from "../errors/CustomError";
import mongoose from "mongoose";

export interface PaginatedTransactions {
  transactions: Array<any>;
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

const getTransactionsService = async (
  userId: string,
  page: number,
  limit: number
): Promise<any> => {
  if (!userId) {
    throw new CustomError("User ID is required to fetch transactions.", 400);
  }

  const skip = (page - 1) * limit;

  const [expenses, incomes] = await Promise.all([
    Expense.find({ user_id: userId }).lean(),
    Income.find({ user_id: userId }).lean(),
  ]);

  const allTransactions = [...expenses, ...incomes].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const paginatedTransactions = allTransactions.slice(skip, skip + limit);
  const totalTransactions = allTransactions.length;
  const totalPages = Math.ceil(totalTransactions / limit);

  if (!paginatedTransactions.length) {
    return [];
  }

  return {
    transactions: paginatedTransactions,
    totalItems: totalTransactions,
    totalPages,
    currentPage: page,
    pageSize: limit,
  };
};

const getTotalIncomeForUserService = async (
  user_id: string
): Promise<number> => {
  if (!user_id) {
    throw new CustomError("User ID is required to fetch income.", 400);
  }
  const userObjectId = mongoose.Types.ObjectId.isValid(user_id)
    ? new mongoose.Types.ObjectId(user_id)
    : user_id;

  try {
    const totalIncome = await Income.aggregate([
      {
        $match: { user_id: userObjectId },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$accumulated_amount" },
        },
      },
    ]);
    return totalIncome[0]?.total || 0;
  } catch (error) {
    throw new CustomError(
      "An error occurred while fetching the total income.",
      500
    );
  }
};

const getTotalExpenseForUserService = async (
  user_id: string
): Promise<number> => {
  if (!user_id) {
    throw new CustomError("User ID is required to fetch expenses.", 400);
  }

  const userObjectId = mongoose.Types.ObjectId.isValid(user_id)
    ? new mongoose.Types.ObjectId(user_id)
    : user_id;

  try {
    const totalExpense = await Expense.aggregate([
      {
        $match: { user_id: userObjectId },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$accumulated_amount" },
        },
      },
    ]);

    return totalExpense[0]?.total || 0;
  } catch (error) {
    throw new CustomError(
      "An error occurred while fetching the total expense.",
      500
    );
  }
};

const getAccountBalanceForUserService = async (
  user_id: string
): Promise<number> => {
  if (!user_id) {
    throw new CustomError("User ID is required to fetch account balance.", 400);
  }

  const totalIncome = await getTotalIncomeForUserService(user_id);
  const totalExpense = await getTotalExpenseForUserService(user_id);
  const balance = totalIncome - totalExpense;

  return balance;
};

export {
  getTransactionsService,
  getTotalIncomeForUserService,
  getTotalExpenseForUserService,
  getAccountBalanceForUserService,
};
