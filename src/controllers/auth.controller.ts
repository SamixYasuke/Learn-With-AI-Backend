import { Request, Response } from "express";
import {
  createUserService,
  loginUserService,
  requestOtpService,
  verifyOtpAndChangePasswordService,
} from "../services/auth.service";
import { asyncHandler } from "../utils/asyncHandler";
import { CustomError } from "../errors/CustomError";

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Create a new user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *               second_name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: integer
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         first_name:
 *                           type: string
 *                         second_name:
 *                           type: string
 *                         email:
 *                           type: string
 *                     token:
 *                       type: string
 *       400:
 *         description: Bad request - Missing required fields
 */
const createUserController = asyncHandler(
  async (req: Request, res: Response) => {
    const { first_name, second_name, email, password } = req.body;
    if (!first_name || !second_name || !email || !password) {
      throw new CustomError("All fields are required", 400);
    }
    const newUser = await createUserService({
      first_name,
      second_name,
      email,
      password,
    });
    res.status(201).json({
      status_code: 201,
      message: "User created successfully",
      data: {
        user: {
          id: newUser.user._id,
          first_name: newUser.user.first_name,
          second_name: newUser.user.second_name,
          email: newUser.user.email,
        },
        token: newUser.token,
      },
    });
  }
);

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Log in a user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: integer
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         first_name:
 *                           type: string
 *                         second_name:
 *                           type: string
 *                         email:
 *                           type: string
 *                     token:
 *                       type: string
 *       400:
 *         description: Bad request - Missing email or password
 */
const loginUserController = asyncHandler(
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new CustomError("Email and password are required.", 400);
    }
    const loggedInUser = await loginUserService(email, password);
    res.status(200).json({
      status_code: 200,
      message: "Login successful.",
      data: {
        user: {
          id: loggedInUser.user._id,
          first_name: loggedInUser.user.first_name,
          second_name: loggedInUser.user.second_name,
          email: loggedInUser.user.email,
        },
        token: loggedInUser.token,
      },
    });
  }
);

/**
 * @swagger
 * /api/v1/auth/request-otp:
 *   post:
 *     summary: Request OTP for password reset
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP sent to email
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: integer
 *                 message:
 *                   type: string
 *       400:
 *         description: Bad request - Missing email
 */
const requestOtpController = asyncHandler(
  async (req: Request, res: Response) => {
    const { email } = req.body;
    if (!email) {
      throw new CustomError("Email and password are required.", 400);
    }
    const otpResponse = await requestOtpService(email);
    res.status(200).json({
      status_code: 200,
      message: otpResponse,
    });
  }
);

/**
 * @swagger
 * /api/v1/auth/verify-otp-and-change-password:
 *   post:
 *     summary: Verify OTP and change user password
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               otp:
 *                 type: string
 *               new_password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password changed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: integer
 *                 message:
 *                   type: string
 *       400:
 *         description: Bad request - Missing required fields
 */
const verifyOtpAndChangePasswordController = asyncHandler(
  async (req: Request, res: Response) => {
    const { email, otp, new_password } = req.body;
    if (!email || !otp || !new_password) {
      throw new CustomError("Email, OTP, and new password are required", 400);
    }
    const message = await verifyOtpAndChangePasswordService(
      email,
      otp,
      new_password
    );
    return res.status(200).json({
      status_code: 200,
      message,
    });
  }
);

export {
  createUserController,
  loginUserController,
  requestOtpController,
  verifyOtpAndChangePasswordController,
};
