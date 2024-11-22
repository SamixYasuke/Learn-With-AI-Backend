import { Router } from "express";
import {
  getExpensesController,
  createExpenseController,
  editExpenseController,
} from "../controllers/expense.controller";
import { authenticateJwt } from "../middlewares/authenticateJwt.middleware";

const router = Router();

router.get("/expenses", authenticateJwt, getExpensesController);

router.post("/expenses", authenticateJwt, createExpenseController);

router.patch("/expenses/:id", authenticateJwt, editExpenseController);

export default router;
