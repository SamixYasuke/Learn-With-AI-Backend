import { Income, IIncome } from "../models/income.model";
import { CustomError } from "../errors/CustomError";
import mongoose from "mongoose";

interface incomeData {
  category_id: string;
  required_amount: string;
  accumulated_amount: string;
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
  const income = new Income(incomeData);
  const savedincome = await income.save();
  return savedincome;
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
    throw new CustomError("income data not found", 404);
  }
  if (user_id !== incomeData.user_id.toString()) {
    throw new CustomError(
      "User doesn't have the right to update this income",
      403
    );
  }

  incomeData.accumulated_amount = accumulated_amount;
  await incomeData.save();
  return "Accumulated amount updated successfully";
};

export { getIncomesService, createIncomeService, editIncomeService };
