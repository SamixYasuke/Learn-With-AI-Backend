import { CustomError } from "../errors/CustomError";
import { User, IUser } from "../models/user.model";
import { verifyPassword, hashPassword } from "../utils/passwordHandler";
import { generateOtp } from "../utils/helper";
import sendOTP from "../Emails/otp.email";
import { generateJwt } from "../utils/helper";
import { getAccountBalanceForUserService } from "./transaction.service";

export interface AuthResponse {
  user: IUser;
  token: string;
  balance?: string | number;
}

const createUserService = async (
  userData: Partial<IUser>
): Promise<AuthResponse> => {
  const existingUser = await User.findOne({ email: userData.email });
  if (existingUser) {
    throw new CustomError("Email already exists.", 403);
  }
  const hashedPassword = await hashPassword(userData.password!);
  const newUser = new User({ ...userData, password: hashedPassword });
  const savedUser = await newUser.save();
  const token = generateJwt({
    id: savedUser._id,
    email: savedUser.email,
  });
  return { user: savedUser, token };
};

const loginUserService = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new CustomError("Invalid email or password.", 400);
  }
  const isPasswordValid = await verifyPassword(user.password, password);
  if (!isPasswordValid) {
    throw new CustomError("Invalid email or password.", 400);
  }
  const token = generateJwt({
    id: user._id,
    email: user.email,
  });
  const balance = await getAccountBalanceForUserService(user?.id);
  return { user, token, balance };
};

const requestOtpService = async (email: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new CustomError("User doesn't exist", 404);
  }
  const otp = generateOtp();
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
  user.otp = otp;
  user.otp_expires_at = expiresAt;
  await user.save();

  const userData = {
    name: `${user.first_name} ${user.second_name}`,
    otp,
    email: user.email,
  };
  await sendOTP(userData);
  return "OTP sent successfully";
};

const verifyOtpAndChangePasswordService = async (
  email: string,
  otp: string,
  newPassword: string
): Promise<string> => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new CustomError("User not found", 404);
  }
  if (user.otp !== otp) {
    throw new CustomError("Invalid OTP", 400);
  }
  const currentTime = new Date();
  if (currentTime > user.otp_expires_at) {
    throw new CustomError("OTP has expired", 400);
  }
  const hashedPassword = await hashPassword(newPassword);
  user.password = hashedPassword;
  user.otp = null;
  user.otp_expires_at = null;
  await user.save();
  return "Password changed successfully";
};

export {
  createUserService,
  loginUserService,
  requestOtpService,
  verifyOtpAndChangePasswordService,
};
