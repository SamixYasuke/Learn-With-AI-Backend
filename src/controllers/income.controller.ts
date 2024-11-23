import { Response, Request } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { CustomError } from "../errors/CustomError";
import {
  getIncomesService,
  createIncomeService,
  editIncomeService,
  categoriseIncomesService,
  getMonthlyIncomesService,
} from "../services/income.service";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

/**
 * @swagger
 * /api/v1/incomes:
 *   get:
 *     summary: Retrieve all incomes for the authenticated user
 *     tags:
 *       - Incomes
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of incomes fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Income Fetched Successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         example: Salary
 *                       category_id:
 *                         type: string
 *                         example: 64ad6f84c68a9d31c4ecf9d7
 *                       required_amount:
 *                         type: number
 *                         example: 5000
 *                       accumulated_amount:
 *                         type: number
 *                         example: 2000
 *                       income_percentage:
 *                         type: number
 *                         example: 40
 *       401:
 *         description: Unauthorized access.
 */
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

/**
 * @swagger
 * /api/v1/incomes:
 *   post:
 *     summary: Create a new income
 *     tags:
 *       - Incomes
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
 *               - category_id
 *               - required_amount
 *               - accumulated_amount
 *             properties:
 *               name:
 *                 type: string
 *                 example: Salary
 *               category_id:
 *                 type: string
 *                 example: 64ad6f84c68a9d31c4ecf9d7
 *               required_amount:
 *                 type: number
 *                 example: 5000
 *               accumulated_amount:
 *                 type: number
 *                 example: 2000
 *     responses:
 *       201:
 *         description: Income created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: integer
 *                   example: 201
 *                 message:
 *                   type: string
 *                   example: Income Created Successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 64ad6f84c68a9d31c4ecf9d7
 *                     name:
 *                       type: string
 *                       example: Salary
 *                     category_id:
 *                       type: string
 *                       example: 64ad6f84c68a9d31c4ecf9d7
 *                     required_amount:
 *                       type: number
 *                       example: 5000
 *                     accumulated_amount:
 *                       type: number
 *                       example: 2000
 *                     income_percentage:
 *                       type: number
 *                       example: 40
 *       400:
 *         description: Bad Request - Invalid input.
 */
const createIncomeController = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { name, category_id, required_amount, accumulated_amount } = req.body;
    const user_id = req.user.id;
    if (!name || !category_id || !required_amount || !accumulated_amount) {
      throw new CustomError("All fields are required!!", 400);
    }
    const incomeData = {
      name,
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

/**
 * @swagger
 * /api/v1/incomes/{id}:
 *   patch:
 *     summary: Update the accumulated amount for an income
 *     tags:
 *       - Incomes
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the income to update
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
 *                 example: 3000
 *     responses:
 *       200:
 *         description: Income updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Accumulated amount updated successfully
 *       400:
 *         description: Bad Request - Invalid input or accumulated amount.
 *       404:
 *         description: Income not found.
 *       403:
 *         description: Unauthorized to update this income.
 */
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

/**
 * @swagger
 * /api/v1/incomes/categories:
 *   get:
 *     summary: Categorize incomes for the authenticated user
 *     tags:
 *       - Incomes
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Income categories fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Income Categories Fetched Successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       category_name:
 *                         type: string
 *                         example: Salary
 *                       total:
 *                         type: number
 *                         example: 2000
 *                       percentage:
 *                         type: string
 *                         example: "50%"
 *                       total_incomes:
 *                         type: number
 *                         example: 4000
 */
const categoriseIncomesController = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const user_id = req.user.id;
    const incomesCategory = await categoriseIncomesService(user_id);
    res.status(200).json({
      status_code: 200,
      message: "Income Categories Fetched Successfully",
      data: incomesCategory,
    });
  }
);

/**
 * @swagger
 * /api/v1/incomes/monthly:
 *   get:
 *     summary: Retrieve daily income data grouped by month and year
 *     tags:
 *       - Incomes
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Monthly incomes fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Monthly Incomes Fetched Successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       year:
 *                         type: integer
 *                         example: 2024
 *                       months:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             month:
 *                               type: integer
 *                               example: 1
 *                             daily:
 *                               type: array
 *                               items:
 *                                 type: object
 *                                 properties:
 *                                   day:
 *                                     type: integer
 *                                     example: 15
 *                                   amount_spent:
 *                                     type: number
 *                                     example: 1000
 */
const getMonthlyIncomesController = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const user_id = req.user.id;
    const monthlyIncomes = await getMonthlyIncomesService(user_id);
    return res.status(200).json({
      status_code: 200,
      message: "Monthly Incomes Fetched Successfully",
      data: monthlyIncomes,
    });
  }
);

export {
  getIncomesController,
  createIncomeController,
  editIncomeController,
  categoriseIncomesController,
  getMonthlyIncomesController,
};
