import upload from "../config/multer.config";
import { Router } from "express";
import { authenticateJwt } from "../middlewares/authenticateJwt.middleware";
import { uploadUserNoteController } from "../controllers/note.controller";

const router = Router();

router.post(
  "/upload",
  authenticateJwt,
  upload.single("note"),
  uploadUserNoteController
);

export default router;
