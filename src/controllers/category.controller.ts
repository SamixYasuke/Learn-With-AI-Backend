import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { CustomError } from "../errors/CustomError";
import {
  createCategoryService,
  getCategoriesService,
} from "../services/category.service";

/**
 * @swagger
 * /api/v1/category:
 *   post:
 *     summary: Create a new category
 *     description: Create a new category with a name and priority type.
 *     tags:
 *       - Categories
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               category_name:
 *                 type: string
 *                 description: The name of the category.
 *                 example: Food
 *               priority_type:
 *                 type: string
 *                 description: The priority type of the category.
 *                 example: want or need
 *     responses:
 *       201:
 *         description: Category created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: integer
 *                   example: 201
 *                 message:
 *                   type: string
 *                   example: Category created successfully
 *                 data:
 *                   $ref: '#/components/schemas/Category'
 *       400:
 *         description: Bad request, category name and priority type are required.
 *       409:
 *         description: Conflict, category already exists.
 */
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

/**
 * @swagger
 * /api/v1/categories:
 *   get:
 *     summary: Get all categories
 *     description: Retrieve a list of all categories.
 *     tags:
 *       - Categories
 *     responses:
 *       200:
 *         description: Categories fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Categories fetched successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Category'
 */
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
