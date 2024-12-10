import express from "express";
import "../config/passport.config";
import {
  registerUserWithEmailPasswordController,
  loginUserWithEmailPasswordController,
} from "../controllers/auth.controller";

const router = express.Router();

router.post("/register", registerUserWithEmailPasswordController);

router.post("/login", loginUserWithEmailPasswordController);

export default router;
