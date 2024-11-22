import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { CustomError } from "../errors/CustomError";
import {
  createCategoryService,
  getCategoriesService,
} from "../services/category.service";

const createCategoryController = asyncHandler(
  async (req: Request, res: Response) => {
    const { category_name, priority_type } = req.body;
    if (!category_name || !priority_type) {
      throw new CustomError(
        "Category name and priority type are required",
        400
      );
    }
    const category = await createCategoryService({
      category_name,
      priority_type,
    });
    res.status(201).json({
      status_code: 201,
      message: "Category created successfully",
      data: category,
    });
  }
);

const getCategoriesController = asyncHandler(
  async (req: Request, res: Response) => {
    const categories = await getCategoriesService();

    res.status(200).json({
      status_code: 200,
      message: "Categories fetched successfully",
      data: categories,
    });
  }
);

export { createCategoryController, getCategoriesController };
