import authRoute from "./auth.route";
import noteRoute from "./note.route";
import examRoute from "./exam.route";
import { Router } from "express";

const router = Router();

router.use("/auth", authRoute);
router.use("/notes", noteRoute);
router.use("/exams", examRoute);

export default router;
