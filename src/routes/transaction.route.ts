import { Router } from "express";
import { authenticateJwt } from "../middlewares/authenticateJwt.middleware";
import {
  getAllTransactionsController,
  createIncomeController,
  categoriseExpenseController,
  categoriseIncomeController,
  createExpenseController,
  getExpenseSummaryController,
  getIncomeSummaryController,
  getTotalExpenseController,
  getTotalIncomeController,
} from "../controllers/transaction.controller";

const router = Router();

router.get("/transactions", authenticateJwt, getAllTransactionsController);

router.post("/transactions/income", authenticateJwt, createIncomeController);

router.get(
  "/transactions/income/total",
  authenticateJwt,
  getTotalIncomeController
);

router.get(
  "/transactions/income/categorize",
  authenticateJwt,
  categoriseIncomeController
);

router.get(
  "/transactions/income/summary",
  authenticateJwt,
  getIncomeSummaryController
);

router.post("/transactions/expense", authenticateJwt, createExpenseController);

router.get(
  "/transactions/expense/total",
  authenticateJwt,
  getTotalExpenseController
);

router.get(
  "/transactions/expense/categorize",
  authenticateJwt,
  categoriseExpenseController
);

router.get(
  "/transactions/expense/summary",
  authenticateJwt,
  getExpenseSummaryController
);

export default router;
