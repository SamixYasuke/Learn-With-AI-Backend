import {
  createUserController,
  loginUserController,
} from "../controllers/user.controller";
import { Router } from "express";

const router = Router();

router.post("/register", createUserController);
router.post("/login", loginUserController);

export default router;
