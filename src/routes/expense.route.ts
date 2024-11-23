import { Router } from "express";
import {
  getExpensesController,
  createExpenseController,
  editExpenseController,
  categoriseExpensesController,
} from "../controllers/expense.controller";
import { authenticateJwt } from "../middlewares/authenticateJwt.middleware";

const router = Router();

router.get("/expenses", authenticateJwt, getExpensesController);

router.post("/expenses", authenticateJwt, createExpenseController);

router.patch("/expenses/:id", authenticateJwt, editExpenseController);

router.get(
  "/expenses/categories",
  authenticateJwt,
  categoriseExpensesController
);

export default router;
