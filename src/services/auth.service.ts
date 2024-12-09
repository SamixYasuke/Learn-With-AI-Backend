import { User } from "../models";
import { CustomError } from "../errors/CustomError";
import { hashPassword, verifyPassword } from "../utils/passwordHandler";
import { generateJwt } from "../utils/helper";

const registerUserWithEmailPasswordService = async (
  email: string,
  password: string,
  name: string
) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new CustomError("User with email is already registered", 400);
  }
  const hashedPassword = await hashPassword(password);
  const user = await User.create({
    email,
    password: hashedPassword,
    name,
  });
  return user;
};

const loginUserWithEmailPasswordService = async (
  email: string,
  password: string
) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new CustomError("User not found", 404);
  }
  const isMatch = await verifyPassword(user?.password, password);
  if (!isMatch) {
    throw new CustomError("Invalid Password!", 401);
  }
  const token = generateJwt(user);
  return {
    user,
    token,
  };
};

export {
  registerUserWithEmailPasswordService,
  loginUserWithEmailPasswordService,
};
