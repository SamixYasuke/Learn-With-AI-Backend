import { Goal, IGoal } from "../models/goal.model";
import { CustomError } from "../errors/CustomError";
import mongoose from "mongoose";

interface GoalData {
  name: string;
  required_amount: string;
  accumulated_amount: string;
  user_id: string;
}

const getGoalsService = async (user_id: string): Promise<any[]> => {
  if (!mongoose.Types.ObjectId.isValid(user_id)) {
    throw new CustomError("Invalid user ID", 400);
  }

  const goals = await Goal.find({ user_id: user_id });
  return goals;
};

const createGoalService = async (goalData: GoalData): Promise<IGoal> => {
  const goal = new Goal(goalData);
  const savedGoals = await goal.save();
  return savedGoals;
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

  goalData.accumulated_amount = accumulated_amount;
  await goalData.save();
  return "Accumulated amount updated successfully";
};

export { getGoalsService, createGoalService, editGoalService };
