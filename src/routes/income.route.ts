import { Router } from "express";
import { authenticateJwt } from "../middlewares/authenticateJwt.middleware";
import {
  createIncomeController,
  getIncomesController,
  editIncomeController,
  categoriseIncomesController,
} from "../controllers/income.controller";

const router = Router();

router.get("/incomes", authenticateJwt, getIncomesController);

router.post("/incomes", authenticateJwt, createIncomeController);

router.patch("/incomes/:id", authenticateJwt, editIncomeController);

router.get("/incomes/categories", authenticateJwt, categoriseIncomesController);

export default router;
