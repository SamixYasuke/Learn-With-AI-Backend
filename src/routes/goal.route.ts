import { Router } from "express";
import {
  getGoalsController,
  getGoalByIdController,
  createGoalController,
  editGoalController,
  getGoalsStatsController,
} from "../controllers/goal.controller";
import { authenticateJwt } from "../middlewares/authenticateJwt.middleware";

const router = Router();

router.get("/goals/stats", authenticateJwt, getGoalsStatsController);

router.get("/goals", authenticateJwt, getGoalsController);

router.get("/goals/:id", authenticateJwt, getGoalByIdController);

router.post("/goals", authenticateJwt, createGoalController);

router.patch("/goals/:id", authenticateJwt, editGoalController);

export default router;
