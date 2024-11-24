import mongoose from "mongoose";
import { CustomError } from "../errors/CustomError";
import { Transaction, ITransaction } from "../models/transaction.model";

export interface PaginatedTransactions {
  transactions: Array<any>;
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

const getAllTransactionsService = async (user_id: string) => {
  if (!mongoose.Types.ObjectId.isValid(user_id)) {
    throw new Error("Invalid user ID");
  }

  const transactions = await Transaction.find({ user_id })
    .sort({ createdAt: -1 })
    .select("name amount type createdAt")
    .lean();
  return transactions;
};

const createIncomeService = async (
  name: string,
  amount: number,
  type: string,
  category: string,
  user_id: string
): Promise<object> => {
  if (!mongoose.Types.ObjectId.isValid(user_id)) {
    throw new CustomError("Invalid user ID", 400);
  }

  const income = new Transaction({
    name,
    amount,
    type,
    category,
    user_id,
  });
  const saved_income = await income.save();
  return saved_income;
};

const createExpenseService = async (
  name: string,
  amount: number,
  type: string,
  user_id: string,
  category: string
): Promise<object> => {
  if (!mongoose.Types.ObjectId.isValid(user_id)) {
    throw new CustomError("Invalid user ID", 400);
  }
  const expense = new Transaction({
    name,
    amount,
    type,
    user_id,
    category,
  });
  const save_expense = await expense.save();
  return save_expense;
};

const getTotalIncomeService = async (user_id: string): Promise<number> => {
  if (!mongoose.Types.ObjectId.isValid(user_id)) {
    throw new CustomError("Invalid user ID", 400);
  }
  const result = await Transaction.aggregate([
    {
      $match: {
        user_id: new mongoose.Types.ObjectId(user_id),
        type: "income",
      },
    },
    {
      $group: {
        _id: null,
        totalIncome: {
          $sum: { $toDouble: "$amount" },
        },
      },
    },
  ]);
  return result.length > 0 ? result[0].totalIncome : 0;
};

const getTotalExpenseService = async (user_id: string): Promise<number> => {
  if (!mongoose.Types.ObjectId.isValid(user_id)) {
    throw new CustomError("Invalid user ID", 400);
  }
  const result = await Transaction.aggregate([
    {
      $match: {
        user_id: new mongoose.Types.ObjectId(user_id),
        type: "expense",
      },
    },
    {
      $group: {
        _id: null,
        totalExpense: {
          $sum: { $toDouble: "$amount" },
        },
      },
    },
  ]);
  return result.length > 0 ? result[0].totalExpense : 0;
};

const categoriseIncomeService = async (user_id: string): Promise<object> => {
  if (!mongoose.Types.ObjectId.isValid(user_id)) {
    throw new CustomError("Invalid user ID", 400);
  }
  const result = await Transaction.aggregate([
    {
      $match: {
        user_id: new mongoose.Types.ObjectId(user_id),
        type: "income",
      },
    },

    {
      $group: {
        _id: "$category",
        total: { $sum: { $toDouble: "$amount" } },
      },
    },

    {
      $lookup: {
        from: "categories",
        localField: "_id",
        foreignField: "_id",
        as: "categoryDetails",
      },
    },

    {
      $unwind: "$categoryDetails",
    },

    {
      $group: {
        _id: null,
        categories: {
          $push: {
            category_name: "$categoryDetails.category_name",
            total: "$total",
          },
        },
        total_income: { $sum: "$total" },
      },
    },

    {
      $project: {
        _id: 0,
        total_income: 1,
        categories: {
          $map: {
            input: "$categories",
            as: "category",
            in: {
              category_name: "$$category.category_name",
              total: "$$category.total",
              percentage: {
                $multiply: [
                  { $divide: ["$$category.total", "$total_income"] },
                  100,
                ],
              },
            },
          },
        },
      },
    },
  ]);

  return result.length > 0 ? result[0] : { total_income: 0, categories: [] };
};

const categoriseExpenseService = async (user_id: string) => {
  if (!mongoose.Types.ObjectId.isValid(user_id)) {
    throw new CustomError("Invalid user ID", 400);
  }
  const result = await Transaction.aggregate([
    {
      $match: {
        user_id: new mongoose.Types.ObjectId(user_id),
        type: "expense",
      },
    },

    {
      $group: {
        _id: "$category",
        total: { $sum: { $toDouble: "$amount" } },
      },
    },

    {
      $lookup: {
        from: "categories",
        localField: "_id",
        foreignField: "_id",
        as: "categoryDetails",
      },
    },

    {
      $unwind: "$categoryDetails",
    },

    {
      $group: {
        _id: null,
        categories: {
          $push: {
            category_name: "$categoryDetails.category_name",
            total: "$total",
          },
        },
        total_expenses: { $sum: "$total" },
      },
    },

    {
      $project: {
        _id: 0,
        total_expenses: 1,
        categories: {
          $map: {
            input: "$categories",
            as: "category",
            in: {
              category_name: "$$category.category_name",
              total: "$$category.total",
              percentage: {
                $multiply: [
                  { $divide: ["$$category.total", "$total_expenses"] },
                  100,
                ],
              },
            },
          },
        },
      },
    },
  ]);

  return result.length > 0 ? result[0] : { total_expenses: 0, categories: [] };
};

const getIncomeSummaryService = async (user_id: string) => {
  if (!mongoose.Types.ObjectId.isValid(user_id)) {
    throw new CustomError("Invalid user ID", 400);
  }

  const result = await Transaction.aggregate([
    {
      $match: {
        user_id: new mongoose.Types.ObjectId(user_id),
        type: "income",
      },
    },

    {
      $project: {
        year: { $year: "$createdAt" },
        month: { $month: "$createdAt" },
        day: { $dayOfMonth: "$createdAt" },
        amount: { $toDouble: "$amount" },
      },
    },

    {
      $group: {
        _id: {
          year: "$year",
          month: "$month",
          day: "$day",
        },
        amount_spent: { $sum: "$amount" },
      },
    },

    {
      $group: {
        _id: {
          year: "$_id.year",
          month: "$_id.month",
        },
        daily: {
          $push: {
            day: "$_id.day",
            amount_spent: "$amount_spent",
          },
        },
      },
    },

    {
      $group: {
        _id: "$_id.year",
        months: {
          $push: {
            month: "$_id.month",
            daily: "$daily",
          },
        },
      },
    },

    {
      $project: {
        _id: 0,
        year: "$_id",
        months: 1,
      },
    },

    { $sort: { year: 1, "months.month": 1 } },
  ]);

  return result;
};

const getExpenseSummaryService = async (user_id: string) => {
  if (!mongoose.Types.ObjectId.isValid(user_id)) {
    throw new CustomError("Invalid user ID", 400);
  }

  const result = await Transaction.aggregate([
    {
      $match: {
        user_id: new mongoose.Types.ObjectId(user_id),
        type: "expense",
      },
    },

    {
      $project: {
        year: { $year: "$createdAt" },
        month: { $month: "$createdAt" },
        day: { $dayOfMonth: "$createdAt" },
        amount: { $toDouble: "$amount" },
      },
    },

    {
      $group: {
        _id: {
          year: "$year",
          month: "$month",
          day: "$day",
        },
        amount_spent: { $sum: "$amount" },
      },
    },

    {
      $group: {
        _id: {
          year: "$_id.year",
          month: "$_id.month",
        },
        daily: {
          $push: {
            day: "$_id.day",
            amount_spent: "$amount_spent",
          },
        },
      },
    },

    {
      $group: {
        _id: "$_id.year",
        months: {
          $push: {
            month: "$_id.month",
            daily: "$daily",
          },
        },
      },
    },

    {
      $project: {
        _id: 0,
        year: "$_id",
        months: 1,
      },
    },

    { $sort: { year: 1, "months.month": 1 } },
  ]);

  return result;
};

const getAccountBalanceForUserService = async (
  user_id: string
): Promise<number> => {
  if (!mongoose.Types.ObjectId.isValid(user_id)) {
    throw new CustomError("Invalid user ID", 400);
  }

  const [total_income, total_expense] = await Promise.all([
    getTotalIncomeService(user_id),
    getTotalExpenseService(user_id),
  ]);

  const balance = total_income - total_expense;
  return balance;
};

export {
  getAllTransactionsService,
  createIncomeService,
  createExpenseService,
  getTotalIncomeService,
  getTotalExpenseService,
  categoriseIncomeService,
  categoriseExpenseService,
  getIncomeSummaryService,
  getExpenseSummaryService,
  getAccountBalanceForUserService,
};
