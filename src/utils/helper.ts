import jwt, { JwtPayload } from "jsonwebtoken";
import { CustomError } from "../errors/CustomError";
import { randomBytes } from "crypto";
import cloudinary from "../config/cloudinary.config";
import pdfParse from "pdf-parse";
import mammoth from "mammoth";
import textract from "textract";
import fs from "fs/promises";
import fsSync from "fs";

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRATION = process.env.JWT_EXPIRATION;

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

/**
 * Upload a file to Cloudinary.
 * @param {string} filePath - The path of the file to upload.
 * @returns {Promise<Object>} The result of the upload containing file metadata.
 * @throws {Error} If the file upload fails.
 */
const uploadToCloudinary = async (filePath: string) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: "raw",
      folder: "lesson_notes",
    });
    await fs.unlink(filePath);
    return result;
  } catch (error) {
    throw new Error("File upload to Cloudinary failed!");
  }
};

/**
 * Converts a document file (PDF, DOC, DOCX, TXT) to text based on its MIME type.
 * @param {string} filePath - The path to the file.
 * @param {string} mimeType - The MIME type of the file (e.g., application/pdf, text/plain).
 * @returns {Promise<string>} - The extracted text content.
 */
const docToText = async (
  filePath: string,
  mimeType: string
): Promise<string> => {
  try {
    let extractedText = "";

    switch (mimeType) {
      case "application/pdf":
        const pdfBuffer = fsSync.readFileSync(filePath);
        const pdfData = await pdfParse(pdfBuffer);
        extractedText = pdfData.text;
        break;

      case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        const docxBuffer = fsSync.readFileSync(filePath);
        const docxData = await mammoth.extractRawText({ buffer: docxBuffer });
        extractedText = docxData.value;
        break;

      case "application/msword":
        extractedText = await new Promise((resolve, reject) => {
          textract.fromFileWithPath(filePath, (err, text) => {
            if (err) return reject(err);
            resolve(text);
          });
        });
        break;

      case "text/plain":
        extractedText = fsSync.readFileSync(filePath, "utf8");
        break;

      default:
        throw new Error(`Unsupported MIME type: ${mimeType}`);
    }

    await fs.unlink(filePath);
    return extractedText;
  } catch (error) {
    try {
      await fs.unlink(filePath);
    } catch (unlinkError) {
      console.error(`Failed to delete file: ${unlinkError.message}`);
    }
    throw new Error(`Error extracting text: ${error.message}`);
  }
};

export { generateOtp, generateJwt, verifyJwt, uploadToCloudinary, docToText };
