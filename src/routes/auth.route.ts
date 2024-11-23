import {
  createUserController,
  loginUserController,
  requestOtpController,
  verifyOtpAndChangePasswordController,
} from "../controllers/user.controller";
import { Router } from "express";

const router = Router();

router.post("/register", createUserController);
router.post("/login", loginUserController);
router.post("/request-otp", requestOtpController);
router.post(
  "/verify-otp-and-change-password",
  verifyOtpAndChangePasswordController
);

export default router;
