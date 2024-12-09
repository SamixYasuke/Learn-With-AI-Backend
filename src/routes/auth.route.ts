import express from "express";
import passport from "passport";
import "../config/passport.config";
import {
  registerUserWithEmailPasswordController,
  loginUserWithEmailPasswordController,
  authenticateWithGoogleAuthController,
} from "../controllers/auth.controller";

const router = express.Router();

router.post("/register", registerUserWithEmailPasswordController);

router.post("/login", loginUserWithEmailPasswordController);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate(
    "google",
    { session: false },
    authenticateWithGoogleAuthController
  )
);

export default router;
