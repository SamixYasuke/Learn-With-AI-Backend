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
 *     tags: [Auth]
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
        balance: newUser.balance,
      },
    });
  }
);

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: User Login
 *     tags:
 *       - Auth
 *     description: Authenticates a user with their email and password, returning a token and user details.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The email address of the user.
 *               password:
 *                 type: string
 *                 format: password
 *                 description: The password of the user.
 *             required:
 *               - email
 *               - password
 *           example:
 *             email: "user@example.com"
 *             password: "password123"
 *     responses:
 *       200:
 *         description: Successful login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Login successful.
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           format: uuid
 *                           description: The unique identifier of the user.
 *                         first_name:
 *                           type: string
 *                           description: The first name of the user.
 *                         second_name:
 *                           type: string
 *                           description: The second name of the user.
 *                         email:
 *                           type: string
 *                           format: email
 *                           description: The email address of the user.
 *                     token:
 *                       type: string
 *                       description: JWT token for authenticated requests.
 *                     balance:
 *                       type: number
 *                       description: The user's account balance.
 *             example:
 *               status_code: 200
 *               message: Login successful.
 *               data:
 *                 user:
 *                   id: "64a7bf2e47d3f2b1c6c9d8c3"
 *                   first_name: "John"
 *                   second_name: "Doe"
 *                   email: "user@example.com"
 *                 token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 balance: 1000.00
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
        balance: loggedInUser.balance,
      },
    });
  }
);

/**
 * @swagger
 * /api/v1/auth/request-otp:
 *   post:
 *     summary: Request OTP for password reset
 *     tags: [Auth]
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
 *     tags: [Auth]
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
