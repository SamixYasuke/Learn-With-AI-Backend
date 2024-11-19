import argon2 from "argon2";

export const hashPassword = async (password: string): Promise<string> => {
  try {
    const hashedPassword = await argon2.hash(password, {
      type: argon2.argon2id,
    });
    return hashedPassword;
  } catch (err) {
    throw new Error("Failed to hash password");
  }
};

export const verifyPassword = async (
  hashedPassword: string,
  plainPassword: string
): Promise<boolean> => {
  try {
    return await argon2.verify(hashedPassword, plainPassword);
  } catch (err) {
    throw new Error("Failed to verify password");
  }
};
