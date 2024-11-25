import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import {
  getAllTransactionsService,
  categoriseExpenseService,
  categoriseIncomeService,
  createExpenseService,
  createIncomeService,
  getExpenseSummaryService,
  getIncomeSummaryService,
  getTotalExpenseService,
  getTotalIncomeService,
  getAccountBalanceForUserService,
} from "../services/transaction.service";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

/**
 * @swagger
 * /api/v1/transactions:
 *   get:
 *     summary: Retrieve all transactions for a user
 *     description: Fetches all transactions of a user sorted by the most recent. The user ID is obtained from the authentication token.
 *     tags:
 *       - Transactions
 *     responses:
 *       200:
 *         description: Transactions fetched successfully
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
 *                   example: Transactions fetched successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     transactions:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                             description: The name of the transaction.
 *                             example: "Salary"
 *                           amount:
 *                             type: string
 *                             description: The amount of the transaction.
 *                             example: "5000"
 *                           type:
 *                             type: string
 *                             description: The type of transaction (income or expense).
 *                             example: "income"
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                             description: The timestamp when the transaction was created.
 *                             example: "2024-11-24T16:25:42.677Z"
 *       400:
 *         description: Invalid user ID or authentication error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: Invalid user ID
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: Something went wrong, please try again later.
 */
const getAllTransactionsController = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const user_id = req?.user?.id;

    const transactions = await getAllTransactionsService(user_id);
    return res.status(200).json({
      status_code: 200,
      message: "Transactions fetched successfully",
      data: {
        transactions,
      },
    });
  }
);

/**
 * @swagger
 * /api/v1/transactions/income:
 *   post:
 *     summary: Create a new income transaction
 *     description: Creates a new income transaction for a user. The user ID is fetched from the authentication token, and the required fields are provided in the request body.
 *     tags:
 *       - Transactions
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name or description of the income transaction.
 *                 example: "Salary"
 *               amount:
 *                 type: number
 *                 description: The amount of the income transaction.
 *                 example: 5000
 *               category:
 *                 type: string
 *                 description: The category ID associated with the income.
 *                 example: "605c72ef1532074f4d12f5ad"
 *     responses:
 *       201:
 *         description: Income created successfully
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
 *                   example: Income created successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     income_response:
 *                       type: object
 *                       properties:
 *                         name:
 *                           type: string
 *                           description: The name of the income transaction.
 *                           example: "Salary"
 *                         amount:
 *                           type: number
 *                           description: The amount of the income transaction.
 *                           example: 5000
 *                         type:
 *                           type: string
 *                           description: The type of the transaction (income).
 *                           example: "income"
 *                         category:
 *                           type: string
 *                           description: The category associated with the income transaction.
 *                           example: "605c72ef1532074f4d12f5ad"
 *                         user_id:
 *                           type: string
 *                           description: The ID of the user who created the income transaction.
 *                           example: "605c72ef1532074f4d12f5ad"
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *                           description: The timestamp when the income was created.
 *                           example: "2024-11-24T16:25:42.677Z"
 *       400:
 *         description: Invalid user ID or missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: Invalid user ID
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: Something went wrong, please try again later.
 */
const createIncomeController = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const user_id = req?.user?.id;
    const { name, amount, category } = req.body;
    const type = "income";

    const income_response = await createIncomeService(
      name,
      amount,
      type,
      category,
      user_id
    );

    return res.status(201).json({
      status_code: 201,
      message: "Income created successfully",
      data: {
        income_response,
      },
    });
  }
);

/**
 * @swagger
 * /api/v1/transactions/expense:
 *   post:
 *     summary: Create a new expense transaction
 *     description: Creates a new expense transaction for a user. The user ID is fetched from the authentication token, and the required fields are provided in the request body.
 *     tags:
 *       - Transactions
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name or description of the expense transaction.
 *                 example: "Grocery Shopping"
 *               amount:
 *                 type: number
 *                 description: The amount of the expense transaction.
 *                 example: 100
 *               category:
 *                 type: string
 *                 description: The category ID associated with the expense.
 *                 example: "605c72ef1532074f4d12f5ad"
 *     responses:
 *       201:
 *         description: Expense created successfully
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
 *                   example: Expense created successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     expense_response:
 *                       type: object
 *                       properties:
 *                         name:
 *                           type: string
 *                           description: The name of the expense transaction.
 *                           example: "Grocery Shopping"
 *                         amount:
 *                           type: number
 *                           description: The amount of the expense transaction.
 *                           example: 100
 *                         type:
 *                           type: string
 *                           description: The type of the transaction (expense).
 *                           example: "expense"
 *                         category:
 *                           type: string
 *                           description: The category associated with the expense transaction.
 *                           example: "605c72ef1532074f4d12f5ad"
 *                         user_id:
 *                           type: string
 *                           description: The ID of the user who created the expense transaction.
 *                           example: "605c72ef1532074f4d12f5ad"
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *                           description: The timestamp when the expense was created.
 *                           example: "2024-11-24T16:25:42.677Z"
 *       400:
 *         description: Invalid user ID or missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: Invalid user ID
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: Something went wrong, please try again later.
 */
const createExpenseController = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const user_id = req?.user?.id;
    const { name, amount, category } = req.body;
    const type = "expense";

    const expense_response = await createExpenseService(
      name,
      amount,
      type,
      user_id,
      category
    );

    return res.status(201).json({
      status_code: 201,
      message: "Expense created successfully",
      data: {
        expense_response,
      },
    });
  }
);

/**
 * @swagger
 * /api/v1/transactions/income/total:
 *   get:
 *     summary: Get total income for a user
 *     description: Retrieves the total income for a specific user based on their transactions. The user ID is fetched from the authentication token.
 *     tags:
 *       - Transactions
 *     responses:
 *       200:
 *         description: Total income fetched successfully
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
 *                   example: Total income fetched successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     total_income:
 *                       type: number
 *                       description: The total income amount for the user.
 *                       example: 1500
 *       400:
 *         description: Invalid user ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: Invalid user ID
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: Something went wrong, please try again later.
 */
const getTotalIncomeController = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const user_id = req?.user?.id;

    const total_income = await getTotalIncomeService(user_id);
    return res.status(200).json({
      status_code: 200,
      message: "Total income fetched successfully",
      data: {
        total_income,
      },
    });
  }
);

/**
 * @swagger
 * /api/v1/transactions/expense/total:
 *   get:
 *     summary: Get total expense for a user
 *     description: Retrieves the total expense for a specific user based on their transactions. The user ID is fetched from the authentication token.
 *     tags:
 *       - Transactions
 *     responses:
 *       200:
 *         description: Total expense fetched successfully
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
 *                   example: Total expense fetched successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     total_expense:
 *                       type: number
 *                       description: The total expense amount for the user.
 *                       example: 500
 *       400:
 *         description: Invalid user ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: Invalid user ID
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: Something went wrong, please try again later.
 */
const getTotalExpenseController = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const user_id = req?.user?.id;

    const total_expense = await getTotalExpenseService(user_id);
    return res.status(200).json({
      status_code: 200,
      message: "Total expense fetched successfully",
      data: {
        total_expense,
      },
    });
  }
);

/**
 * @swagger
 * /api/v1/transactions/income/categorize:
 *   get:
 *     summary: Categorize income for a user
 *     description: Retrieves categorized income for a user, grouped by category, with the total income and percentage contribution of each category.
 *     tags:
 *       - Transactions
 *     responses:
 *       200:
 *         description: Categorized income fetched successfully
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
 *                   example: Categorized Income fetched successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     total_income:
 *                       type: number
 *                       description: The total income for the user.
 *                       example: 1000
 *                     categories:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           category_name:
 *                             type: string
 *                             description: The name of the income category.
 *                             example: "Salary"
 *                           total:
 *                             type: number
 *                             description: The total amount for the income category.
 *                             example: 500
 *                           percentage:
 *                             type: number
 *                             description: The percentage of the total income for the category.
 *                             example: 50
 *       400:
 *         description: Invalid user ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: Invalid user ID
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: Something went wrong, please try again later.
 */
const categoriseIncomeController = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const user_id = req?.user?.id;

    const categorize_income = await categoriseIncomeService(user_id);
    return res.status(200).json({
      status_code: 200,
      message: "Categorized Income fetched successfully",
      data: {
        categorize_income,
      },
    });
  }
);

/**
 * @swagger
 * /api/v1/transactions/expense/categorize:
 *   get:
 *     summary: Categorize expense for a user
 *     description: Retrieves categorized expenses for a user, grouped by category, with the total expenses and percentage contribution of each category.
 *     tags:
 *       - Transactions
 *     responses:
 *       200:
 *         description: Categorized expense fetched successfully
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
 *                   example: Categorized Expense fetched successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     total_expenses:
 *                       type: number
 *                       description: The total expenses for the user.
 *                       example: 500
 *                     categories:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           category_name:
 *                             type: string
 *                             description: The name of the expense category.
 *                             example: "Utilities"
 *                           total:
 *                             type: number
 *                             description: The total amount for the expense category.
 *                             example: 200
 *                           percentage:
 *                             type: number
 *                             description: The percentage of the total expenses for the category.
 *                             example: 40
 *       400:
 *         description: Invalid user ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: Invalid user ID
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: Something went wrong, please try again later.
 */
const categoriseExpenseController = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const user_id = req?.user?.id;

    const categorize_expense = await categoriseExpenseService(user_id);
    return res.status(200).json({
      status_code: 200,
      message: "Categorized Expense fetched successfully",
      data: {
        categorize_expense,
      },
    });
  }
);

/**
 * @swagger
 * /api/v1/transactions/income/summary:
 *   get:
 *     summary: Get income summary for a user
 *     description: Retrieves the income summary for a user, grouped by year and month. The summary includes daily income amounts and overall monthly and yearly income.
 *     tags:
 *       - Transactions
 *     responses:
 *       200:
 *         description: Income summary fetched successfully
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
 *                   example: Income Summary fetched successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     income_summary:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           year:
 *                             type: integer
 *                             description: The year of the income summary.
 *                             example: 2023
 *                           months:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 month:
 *                                   type: integer
 *                                   description: The month of the income summary (1-12).
 *                                   example: 5
 *                                 daily:
 *                                   type: array
 *                                   items:
 *                                     type: object
 *                                     properties:
 *                                       day:
 *                                         type: integer
 *                                         description: The day of the month.
 *                                         example: 15
 *                                       amount_spent:
 *                                         type: number
 *                                         description: The amount of income on that specific day.
 *                                         example: 100
 *       400:
 *         description: Invalid user ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: Invalid user ID
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: Something went wrong, please try again later.
 */
const getIncomeSummaryController = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const user_id = req?.user?.id;

    const income_summary = await getIncomeSummaryService(user_id);
    return res.status(200).json({
      status_code: 200,
      message: "Income Summary fetched successfully",
      data: {
        income_summary,
      },
    });
  }
);

/**
 * @swagger
 * /api/v1/transactions/expense/summary:
 *   get:
 *     summary: Get expense summary for a user
 *     description: Retrieves the expense summary for a user, grouped by year and month. The summary includes daily expense amounts and overall monthly and yearly expenses.
 *     tags:
 *       - Transactions
 *     responses:
 *       200:
 *         description: Expense summary fetched successfully
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
 *                   example: Expense Summary fetched successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     expense_summary:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           year:
 *                             type: integer
 *                             description: The year of the expense summary.
 *                             example: 2023
 *                           months:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 month:
 *                                   type: integer
 *                                   description: The month of the expense summary (1-12).
 *                                   example: 5
 *                                 daily:
 *                                   type: array
 *                                   items:
 *                                     type: object
 *                                     properties:
 *                                       day:
 *                                         type: integer
 *                                         description: The day of the month.
 *                                         example: 15
 *                                       amount_spent:
 *                                         type: number
 *                                         description: The amount of expense on that specific day.
 *                                         example: 100
 *       400:
 *         description: Invalid user ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: Invalid user ID
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: Something went wrong, please try again later.
 */
const getExpenseSummaryController = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const user_id = req?.user?.id;
    const expense_summary = await getExpenseSummaryService(user_id);
    return res.status(200).json({
      status_code: 200,
      message: "Expense Summary fetched successfully",
      data: {
        expense_summary,
      },
    });
  }
);

/**
 * @swagger
 * /api/v1/tranactions/balance:
 *   get:
 *     summary: Fetch the account balance for the authenticated user
 *     description: Retrieve the total balance for the authenticated user by calculating the difference between their total income and total expenses.
 *     tags:
 *       - Transactions
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User balance fetched successfully
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
 *                   example: User balance fetched successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     balance:
 *                       type: number
 *                       example: 150.25
 *       400:
 *         description: Invalid user ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: Invalid user ID
 *       401:
 *         description: Unauthorized - Token missing or invalid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: integer
 *                   example: 401
 *                 message:
 *                   type: string
 *                   example: Unauthorized
 */
const getAccountBalanceForUserController = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const user_id = req?.user?.id;
    const balance = await getAccountBalanceForUserService(user_id);
    return res.status(200).json({
      status_code: 200,
      message: "User balance fetched successfully",
      data: {
        balance,
      },
    });
  }
);

export {
  getAllTransactionsController,
  createIncomeController,
  createExpenseController,
  getTotalIncomeController,
  getTotalExpenseController,
  categoriseIncomeController,
  categoriseExpenseController,
  getIncomeSummaryController,
  getExpenseSummaryController,
  getAccountBalanceForUserController,
};
