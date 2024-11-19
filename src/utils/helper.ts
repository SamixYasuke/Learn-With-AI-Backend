import { randomBytes } from "crypto";

const generateOtp = (): string => {
  return randomBytes(3).toString("hex");
};

export { generateOtp };
