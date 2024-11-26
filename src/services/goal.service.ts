import { Goal, IGoal } from "../models/goal.model";
import { CustomError } from "../errors/CustomError";
import mongoose from "mongoose";

interface GoalData {
  name: string;
  required_amount: number;
  accumulated_amount: number;
  user_id: string;
}

const getGoalsService = async (user_id: string): Promise<any[]> => {
  if (!mongoose.Types.ObjectId.isValid(user_id)) {
    throw new CustomError("Invalid user ID", 400);
  }

  const goals = await Goal.find({ user_id: user_id });
  return goals;
};

const getGoalByIdService = async (
  user_id: string,
  goal_id: string
): Promise<any> => {
  if (
    !mongoose.Types.ObjectId.isValid(user_id) ||
    !mongoose.Types.ObjectId.isValid(goal_id)
  ) {
    throw new CustomError("Invalid user ID or goal ID", 400);
  }
  const goal = await Goal.findOne({ _id: goal_id, user_id: user_id });
  if (!goal) {
    throw new CustomError("Goal not found or does not belong to the user", 404);
  }

  return goal;
};

const createGoalService = async (goalData: any): Promise<IGoal> => {
  const { accumulated_amount, required_amount } = goalData;
  if (required_amount <= 0) {
    throw new CustomError("Required amount must be greater than 0", 400);
  }

  if (accumulated_amount > required_amount) {
    throw new CustomError(
      "Accumulated amount cannot be greater than the required amount",
      400
    );
  }

  const goal_percentage = (accumulated_amount / required_amount) * 100;
  goalData.goal_percentage = goal_percentage;
  const goal = new Goal(goalData);
  const savedGoal = await goal.save();

  return savedGoal;
};

const editGoalService = async (
  goal_id: string,
  accumulated_amount: number,
  user_id: string
): Promise<string> => {
  if (!mongoose.Types.ObjectId.isValid(goal_id)) {
    throw new CustomError("Invalid goal ID", 400);
  }
  const goalData = await Goal.findById(goal_id);

  if (!goalData) {
    throw new CustomError("Goal data not found", 404);
  }

  if (user_id !== goalData.user_id.toString()) {
    throw new CustomError(
      "User doesn't have the right to update this goal",
      403
    );
  }

  if (accumulated_amount > goalData.required_amount) {
    throw new CustomError(
      "Accumulated amount cannot be greater than the required amount",
      400
    );
  }

  const goal_percentage = (accumulated_amount / goalData.required_amount) * 100;
  goalData.accumulated_amount = accumulated_amount;
  goalData.goal_percentage = goal_percentage;
  await goalData.save();
  return "Accumulated amount and goal percentage updated successfully";
};

const getGoalsStatsService = async (user_id: string) => {
  const goals = await Goal.find({ user_id });
  if (!mongoose.Types.ObjectId.isValid(user_id)) {
    throw new CustomError("Invalid user ID", 400);
  }

  if (!goals) {
    throw new CustomError("No goals found for the user", 404);
  }

  const totalGoals = goals.length;
  const completedGoals = goals.filter(
    (goal) => goal.accumulated_amount >= goal.required_amount
  ).length;
  const completionPercentage =
    totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0;

  return {
    totalGoals,
    completedGoals,
    completionPercentage,
  };
};

export {
  getGoalsService,
  getGoalByIdService,
  createGoalService,
  editGoalService,
  getGoalsStatsService,
};
