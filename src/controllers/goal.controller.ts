import { Response, Request } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { CustomError } from "../errors/CustomError";
import {
  getGoalsService,
  getGoalByIdService,
  createGoalService,
  editGoalService,
  getGoalsStatsService,
} from "../services/goal.service";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

/**
 * @swagger
 * tags:
 *   name: Goals
 *   description: API for managing user goals
 */

/**
 * @swagger
 * /api/v1/goals:
 *   get:
 *     summary: Get all goals for the authenticated user
 *     tags: [Goals]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully fetched goals
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: number
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Goal'
 *       401:
 *         description: Unauthorized
 */
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

/**
 * @swagger
 * /api/v1/goals/{id}:
 *   get:
 *     summary: Get a goal by ID for the authenticated user
 *     tags: [Goals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the goal
 *     responses:
 *       200:
 *         description: Successfully fetched the goal
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: number
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Goal'
 *       404:
 *         description: Goal not found
 *       401:
 *         description: Unauthorized
 */
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

/**
 * @swagger
 * /api/v1/goals:
 *   post:
 *     summary: Create a new goal
 *     tags: [Goals]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - required_amount
 *               - accumulated_amount
 *             properties:
 *               name:
 *                 type: string
 *               required_amount:
 *                 type: number
 *               accumulated_amount:
 *                 type: number
 *     responses:
 *       201:
 *         description: Goal created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: number
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Goal'
 *       400:
 *         description: Invalid input data
 */
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

/**
 * @swagger
 * /api/v1/goals/{id}:
 *   patch:
 *     summary: Update an existing goal's accumulated amount
 *     tags: [Goals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the goal
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - accumulated_amount
 *             properties:
 *               accumulated_amount:
 *                 type: number
 *     responses:
 *       200:
 *         description: Goal updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: number
 *                 message:
 *                   type: string
 *       400:
 *         description: Invalid input data
 *       404:
 *         description: Goal not found
 *       403:
 *         description: Forbidden
 */
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

/**
 * @swagger
 * /api/v1/goals/stats:
 *   get:
 *     summary: Retrieve goal statistics for the authenticated user
 *     description: Fetches statistics for all goals associated with the authenticated user. It includes the total number of goals, the number of completed goals, and the percentage of completed goals.
 *     tags:
 *       - Goals
 *     responses:
 *       200:
 *         description: Successfully retrieved goals statistics.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: number
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "Goals statistics retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalGoals:
 *                       type: integer
 *                       example: 5
 *                     completedGoals:
 *                       type: integer
 *                       example: 3
 *                     completionPercentage:
 *                       type: number
 *                       format: float
 *                       example: 60.0
 *       401:
 *         description: Unauthorized. User is not authenticated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: number
 *                   example: 401
 *                 message:
 *                   type: string
 *                   example: "Authentication required. Please log in."
 *       404:
 *         description: No goals found for the user.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: number
 *                   example: 404
 *                 message:
 *                   type: string
 *                   example: "No goals found for the user."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: number
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: "An unexpected error occurred."
 */
const getGoalsStatsController = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const user_id = req?.user?.id;
    const stats = await getGoalsStatsService(user_id);
    res.status(200).json({
      status_code: 200,
      message: "Goals statistics retrieved successfully",
      data: stats,
    });
  }
);

export {
  getGoalsController,
  getGoalByIdController,
  createGoalController,
  editGoalController,
  getGoalsStatsController,
};
