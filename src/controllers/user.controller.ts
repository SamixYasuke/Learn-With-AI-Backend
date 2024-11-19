import { Request, Response } from "express";
import { createUserService, loginUserService } from "../services/user.service";
import { asyncHandler } from "../utils/asyncHandler";
import { IUser } from "../models/user.model";
import { hashPassword } from "../utils/passwordHandler";
import { CustomError } from "../errors/CustomError";

const createUserController = asyncHandler(
  async (req: Request, res: Response) => {
    const { first_name, second_name, email, password } = req.body;
    if (!first_name || !second_name || !email || !password) {
      throw new CustomError("All fields are required", 400);
    }
    const hashed_password = await hashPassword(password);
    const newUser: IUser = await createUserService({
      first_name,
      second_name,
      email,
      password: hashed_password,
    });
    res.status(201).json({
      status_code: 201,
      message: "User created successfully",
      data: {
        user: {
          id: newUser._id,
          first_name: newUser.first_name,
          second_name: newUser.second_name,
          email: newUser.email,
        },
      },
    });
  }
);

const loginUserController = asyncHandler(
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new CustomError("Email and password are required.", 400);
    }
    const user: IUser = await loginUserService(email, password);
    res.status(200).json({
      status_code: 200,
      message: "Login successful.",
      data: {
        user: {
          id: user._id,
          first_name: user.first_name,
          second_name: user.second_name,
          email: user.email,
        },
      },
    });
  }
);

export { createUserController, loginUserController };
