import multer from "multer";
import path from "path";
import fs from "fs";
import { CustomError } from "../errors/CustomError";

export const uploadDir = path.join(__dirname, "../../", "uploads");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync(uploadDir)) {
      console.log(`Creating directory: ${uploadDir}`);
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const filetypes = /\.pdf|\.txt|\.doc/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  if (extname) {
    cb(null, true);
  } else {
    const error = new CustomError(
      "Error: Only .pdf, .txt, or .doc files are allowed!",
      400
    );
    console.error(error.message, file.originalname);
    cb(error);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
});

export default upload;
