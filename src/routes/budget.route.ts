import { Router } from "express";
import {
  createBudgetController,
  getAllBudgetsController,
} from "../controllers/budget.controller";
import { authenticateJwt } from "../middlewares/authenticateJwt.middleware";

const router = Router();

router.post("/budget", authenticateJwt, createBudgetController);

router.get("/budgets", authenticateJwt, getAllBudgetsController);

export default router;
