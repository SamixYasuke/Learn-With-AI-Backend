import upload from "../config/multer.config";
import { Router, Request, Response } from "express";

const router = Router();

router.post("/upload", upload.single("note"), (req: Request, res: Response) => {
  if (req.file) {
    const note = req.file;
    console.log("note", note);
    res.json({
      message: "Video uploaded successfully!",
    });
  } else {
    res.status(400).json({ message: "Failed to upload video" });
  }
});

export default router;
