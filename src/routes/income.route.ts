import { Router } from "express";
import { authenticateJwt } from "../middlewares/authenticateJwt.middleware";
import {
  createIncomeController,
  getIncomesController,
  editIncomeController,
} from "../controllers/income.controller";

const router = Router();

router.get("/incomes", authenticateJwt, getIncomesController);

router.post("/incomes", authenticateJwt, createIncomeController);

router.patch("/incomes/:id", authenticateJwt, editIncomeController);

export default router;
