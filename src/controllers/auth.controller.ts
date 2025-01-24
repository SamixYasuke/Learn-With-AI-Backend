import { asyncHandler } from "../utils/asyncHandler";
import { Request, Response } from "express";
import {
  loginUserWithEmailPasswordService,
  registerUserWithEmailPasswordService,
} from "../services/auth.service";

const registerUserWithEmailPasswordController = asyncHandler(
  async (req: Request, res: Response) => {
    const { email, password, name } = req.body;
    const user = await registerUserWithEmailPasswordService(
      email,
      password,
      name
    );
    res.status(201).json({
      message: "User registered successfully",
      data: user,
    });
  }
);

const loginUserWithEmailPasswordController = asyncHandler(
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = await loginUserWithEmailPasswordService(email, password);
    res.status(200).json({
      message: "Login successful",
      data: user,
    });
  }
);

export {
  registerUserWithEmailPasswordController,
  loginUserWithEmailPasswordController,
};
