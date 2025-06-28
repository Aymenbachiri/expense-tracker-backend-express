import Category from '../models/category-model';

export async function checkCategoryOwnership(
  categoryId: string,
  userId: string,
) {
  const category = await Category.findOne({ _id: categoryId, userId });
  return category;
}
