import express from "express";
import {
  getAllTransactionsController,
  getTotalExpenseForUserController,
  getTotalIncomeForUserController,
  getAccountBalanceController,
} from "../controllers/transaction.controller";
import { authenticateJwt } from "../middlewares/authenticateJwt.middleware";

const router = express.Router();

router.get("/transactions", authenticateJwt, getAllTransactionsController);

router.get(
  "/transactions/income",
  authenticateJwt,
  getTotalIncomeForUserController
);

router.get(
  "/transactions/expense",
  authenticateJwt,
  getTotalExpenseForUserController
);

router.get(
  "/transactions/balance",
  authenticateJwt,
  getAccountBalanceController
);

export default router;
