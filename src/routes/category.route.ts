import { Router } from "express";
import {
  createCategoryController,
  getCategoriesController,
} from "../controllers/category.controller";

const router = Router();

router.post("/category", createCategoryController);
router.get("/categories", getCategoriesController);

export default router;
