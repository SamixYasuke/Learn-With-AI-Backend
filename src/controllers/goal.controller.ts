import { Response, Request } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { CustomError } from "../errors/CustomError";
import {
  getGoalsService,
  getGoalByIdService,
  createGoalService,
  editGoalService,
} from "../services/goal.service";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

const getGoalsController = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const user_id = req.user.id;
    const goals = await getGoalsService(user_id);
    res.status(200).json({
      status_code: 200,
      message: "Goals Fetched Successfully",
      data: goals,
    });
  }
);

const getGoalByIdController = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const user_id = req.user.id;
    const { id } = req.params;
    const goal = await getGoalByIdService(user_id, id);
    res.status(200).json({
      status_code: 200,
      message: "Goals Fetched Successfully",
      data: goal,
    });
  }
);

const createGoalController = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { name, required_amount, accumulated_amount } = req.body;
    const user_id = req.user.id;
    if (!name || !required_amount || !accumulated_amount) {
      throw new CustomError("All fields are required!!", 400);
    }
    const goalData = {
      name,
      required_amount,
      accumulated_amount,
      user_id,
    };
    const createGoal = await createGoalService(goalData);
    res.status(201).json({
      status_code: 201,
      message: "Goal Created Successfully",
      data: createGoal,
    });
  }
);

const editGoalController = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const user_id = req.user.id;
    const { accumulated_amount } = req.body;
    if (!id || !accumulated_amount) {
      throw new CustomError("All fields are required!!", 400);
    }
    const editGoalResponse = await editGoalService(
      id,
      accumulated_amount,
      user_id
    );
    res.status(200).json({
      status_code: 201,
      message: editGoalResponse,
    });
  }
);

export {
  getGoalsController,
  getGoalByIdController,
  createGoalController,
  editGoalController,
};
