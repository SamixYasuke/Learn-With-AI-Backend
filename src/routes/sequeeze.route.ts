import {
  createSqueezeController,
  getAllSqueezesController,
  getSqueezeByIdController,
} from "../controllers/squeeze.controller";

import { Router } from "express";

const router = Router();

router.get("/", getAllSqueezesController);
router.post("/", createSqueezeController);
router.get("/:id", getSqueezeByIdController);

export default router;
