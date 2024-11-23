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

const calculateCategoryTotals = (categorised: Record<string, any[]>) => {
  const totals: Record<string, number> = {};
  for (const [category, expenses] of Object.entries(categorised)) {
    totals[category] = expenses.reduce(
      (sum, expense) => sum + expense.accumulated_amount,
      0
    );
  }
  return totals;
};

const calculateCategoryPercentage = (
  totals: Record<string, number>,
  totalAmount: number
) => {
  const percentages: Record<string, string> = {};
  for (const [category, total] of Object.entries(totals)) {
    const percentage = (total / totalAmount) * 100;
    percentages[category] = `${percentage.toFixed(2)}%`;
  }
  return percentages;
};

export {
  generateOtp,
  generateJwt,
  verifyJwt,
  calculateCategoryTotals,
  calculateCategoryPercentage,
};
