import jwt, { JwtPayload } from "jsonwebtoken";
import { CustomError } from "../errors/CustomError";
import { randomBytes } from "crypto";

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRATION = "1h";

/**
 * Generate a 6-character OTP.
 * @returns A random OTP as a string.
 */
const generateOtp = (): string => {
  return randomBytes(3).toString("hex");
};

/**
 * Generate a JWT token with the provided payload.
 * @param payload - Data to encode in the JWT (e.g., { id, email }).
 * @returns A signed JWT token.
 */
const generateJwt = (payload: object): string => {
  if (!JWT_SECRET) {
    throw new CustomError(
      "JWT_SECRET is not defined in the environment variables.",
      500
    );
  }
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
};

/**
 * Verify the provided JWT token and decode its payload.
 * @param token - JWT token to verify.
 * @returns Decoded token payload if valid.
 * @throws CustomError if the token is invalid or expired.
 */
const verifyJwt = (token: string): JwtPayload | null => {
  try {
    if (!JWT_SECRET) {
      throw new CustomError(
        "JWT_SECRET is not defined in the environment variables.",
        500
      );
    }
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      throw new CustomError("Token has expired.", 401);
    } else if (error.name === "JsonWebTokenError") {
      throw new CustomError("Invalid token.", 401);
    }
    throw new CustomError("Token verification failed.", 500);
  }
};

type SplitIncomeResult = {
  needs: number;
  wants: number;
  savings: number;
};

/**
 * Splits an income into 50% for needs, 30% for wants, and 20% for savings.
 * @param income - The total income to split.
 * @returns An object with the split values for needs, wants, and savings.
 */
const splitIncome = (income: number): SplitIncomeResult => {
  if (income < 0) {
    throw new Error("Income cannot be negative");
  }

  const needs = parseFloat((income * 0.5).toFixed(2));
  const wants = parseFloat((income * 0.3).toFixed(2));
  const savings = parseFloat((income * 0.2).toFixed(2));

  return { needs, wants, savings };
};

export { generateOtp, generateJwt, verifyJwt, splitIncome };
