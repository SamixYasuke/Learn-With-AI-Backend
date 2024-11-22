import { Response, Request } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { CustomError } from "../errors/CustomError";
import {
  getIncomesService,
  createIncomeService,
  editIncomeService,
} from "../services/income.service";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

const getIncomesController = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const user_id = req.user.id;
    const income = await getIncomesService(user_id);
    res.status(200).json({
      status_code: 200,
      message: "Income Fetched Successfully",
      data: income,
    });
  }
);

const createIncomeController = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { category_id, required_amount, accumulated_amount } = req.body;
    const user_id = req.user.id;
    if (!category_id || !required_amount || !accumulated_amount) {
      throw new CustomError("All fields are required!!", 400);
    }
    const incomeData = {
      category_id,
      required_amount,
      accumulated_amount,
      user_id,
    };
    const createincome = await createIncomeService(incomeData);
    res.status(201).json({
      status_code: 201,
      message: "income Created Successfully",
      data: createincome,
    });
  }
);

const editIncomeController = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const user_id = req.user.id;
    const { accumulated_amount } = req.body;
    if (!id || !accumulated_amount) {
      throw new CustomError("All fields are required!!", 400);
    }
    const editincomeResponse = await editIncomeService(
      id,
      accumulated_amount,
      user_id
    );
    res.status(200).json({
      status_code: 201,
      message: editincomeResponse,
    });
  }
);

export { getIncomesController, createIncomeController, editIncomeController };
