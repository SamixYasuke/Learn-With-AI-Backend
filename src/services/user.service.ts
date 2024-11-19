import { CustomError } from "../errors/CustomError";
import { User, IUser } from "../models/user.model";
import { verifyPassword } from "../utils/passwordHandler";

const createUserService = async (userData: Partial<IUser>): Promise<IUser> => {
  const existingUser = await User.findOne({ email: userData.email });
  if (existingUser) {
    throw new CustomError("Email already exists.", 403);
  }
  const newUser = new User(userData);
  const savedUser = await newUser.save();
  return savedUser;
};

const loginUserService = async (
  email: string,
  password: string
): Promise<IUser> => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new CustomError("Invalid email or password.", 400);
  }
  const isPasswordValid = await verifyPassword(user.password, password);
  if (!isPasswordValid) {
    throw new CustomError("Invalid email or password.", 400);
  }
  return user;
};

export { createUserService, loginUserService };
