import { CustomError } from "../errors/CustomError";
import { Category, ICategory } from "../models/category.model";

interface CategoryData {
  category_name: string;
  priority_type: string;
  category_type: string;
}

const createCategoryService = async (
  categoryData: CategoryData
): Promise<ICategory> => {
  const existingCategory = await Category.findOne({
    category_name: categoryData.category_name,
  });

  if (existingCategory) {
    throw new CustomError("Category already exists", 409);
  }

  const newCategory = new Category(categoryData);
  const savedCategory = await newCategory.save();

  return savedCategory;
};

const getCategoriesService = async (): Promise<ICategory[]> => {
  const categories = await Category.find();
  return categories;
};

export { createCategoryService, getCategoriesService };
