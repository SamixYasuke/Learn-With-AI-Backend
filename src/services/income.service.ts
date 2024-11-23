import { Income, IIncome } from "../models/income.model";
import { CustomError } from "../errors/CustomError";
import mongoose from "mongoose";
import { getTotalIncomeForUserService } from "./transaction.service";
import {
  calculateCategoryPercentage,
  calculateCategoryTotals,
} from "../utils/helper";

interface incomeData {
  name: string;
  category_id: string;
  required_amount: number;
  accumulated_amount: number;
  user_id: string;
}

const getIncomesService = async (user_id: string): Promise<any[]> => {
  if (!mongoose.Types.ObjectId.isValid(user_id)) {
    throw new CustomError("Invalid user ID", 400);
  }

  const incomes = await Income.find({ user_id: user_id }).populate(
    "category_id"
  );
  return incomes;
};

const createIncomeService = async (
  incomeData: incomeData
): Promise<IIncome> => {
  const { accumulated_amount, required_amount } = incomeData;
  if (accumulated_amount > required_amount) {
    throw new CustomError(
      "Accumulated amount cannot be greater than the required amount",
      400
    );
  }
  const percentage = (accumulated_amount / required_amount) * 100;
  const income = new Income(incomeData);
  income.income_percentage = percentage;
  const savedIncome = await income.save();
  return savedIncome;
};

const editIncomeService = async (
  income_id: string,
  accumulated_amount: number,
  user_id: string
): Promise<string> => {
  if (!mongoose.Types.ObjectId.isValid(income_id)) {
    throw new CustomError("Invalid income ID", 400);
  }

  const incomeData = await Income.findById(income_id);
  if (!incomeData) {
    throw new CustomError("Income data not found", 404);
  }
  if (user_id !== incomeData.user_id.toString()) {
    throw new CustomError(
      "User doesn't have the right to update this income",
      403
    );
  }

  if (accumulated_amount > incomeData.required_amount) {
    throw new CustomError(
      "Accumulated amount cannot be greater than the required amount",
      400
    );
  }

  const percentage = (accumulated_amount / incomeData.required_amount) * 100;
  incomeData.accumulated_amount = accumulated_amount;
  incomeData.income_percentage = percentage;
  await incomeData.save();
  return "Accumulated amount updated successfully";
};

const categoriseIncomesService = async (user_id: any): Promise<any> => {
  if (!mongoose.Types.ObjectId.isValid(user_id)) {
    throw new CustomError("Invalid user ID", 400);
  }

  const incomes = await Income.find({ user_id }).populate("category_id");
  const total_incomes = await getTotalIncomeForUserService(user_id);
  const categorised = incomes.reduce((result: any, item: any) => {
    const categoryName = item.category_id.category_name;
    if (!result[categoryName]) {
      result[categoryName] = [];
    }
    result[categoryName].push(item);
    return result;
  }, {});

  const totals = calculateCategoryTotals(categorised);
  const percentages = calculateCategoryPercentage(totals, total_incomes);

  const data = Object.entries(totals).map(([category, total]) => ({
    category_name: category,
    percentage: percentages[category],
    total,
    total_incomes,
  }));

  return data;
};

const getMonthlyIncomesService = async (user_id: any): Promise<any> => {
  if (!mongoose.Types.ObjectId.isValid(user_id)) {
    throw new Error("Invalid user ID");
  }

  const monthlyIncomes = await Income.aggregate([
    {
      $match: { user_id: new mongoose.Types.ObjectId(user_id) },
    },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
        amount_spent: { $sum: "$accumulated_amount" },
      },
    },
    {
      $sort: { "_id.year": 1, "_id.month": 1 },
    },
    {
      $project: {
        _id: 0,
        month: "$_id.month",
        amount_spent: 1,
      },
    },
  ]);

  return monthlyIncomes;
};

export {
  getIncomesService,
  createIncomeService,
  editIncomeService,
  categoriseIncomesService,
  getMonthlyIncomesService,
};
