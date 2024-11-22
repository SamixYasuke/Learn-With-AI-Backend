import { Router } from "express";
import {
  getGoalsController,
  createGoalController,
  editGoalController,
} from "../controllers/goal.controller";
import { authenticateJwt } from "../middlewares/authenticateJwt.middleware";

const router = Router();

router.get("/goals", authenticateJwt, getGoalsController);

router.post("/goals", authenticateJwt, createGoalController);

router.patch("/goals/:id", authenticateJwt, editGoalController);

export default router;
