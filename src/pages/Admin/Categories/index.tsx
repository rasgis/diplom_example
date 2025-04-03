import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../../reducers/categorySlice";
import CategoryList from "./CategoryList";
import { Category } from "../../../types";
import { CircularProgress, Box } from "@mui/material";

const CategoryListContainer: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    items: categories,
    loading,
    error,
  } = useAppSelector((state) => state.categories);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleCreateCategory = async (
    categoryData: Omit<
      Category,
      "id" | "slug" | "order" | "createdAt" | "updatedAt"
    >
  ) => {
    // Slug и order будут добавлены на бэкенде, но можно и здесь их добавить
    const category = {
      ...categoryData,
      slug: categoryData.name.toLowerCase().replace(/\s+/g, "-"),
      order: categories.length,
    };
    await dispatch(createCategory(category));
  };

  const handleUpdateCategory = async (
    id: string,
    categoryData: Omit<
      Category,
      "id" | "slug" | "order" | "createdAt" | "updatedAt"
    >
  ) => {
    const existingCategory = categories.find((c) => c.id === id);
    const category = {
      ...categoryData,
      slug:
        existingCategory?.slug ||
        categoryData.name.toLowerCase().replace(/\s+/g, "-"),
      order: existingCategory?.order || 0,
    };
    await dispatch(updateCategory({ id, category }));
  };

  const handleDeleteCategory = async (id: string) => {
    await dispatch(deleteCategory(id));
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ color: "error.main", mt: 2 }}>
        Ошибка при загрузке категорий: {error}
      </Box>
    );
  }

  return (
    <CategoryList
      categories={categories}
      onAdd={handleCreateCategory}
      onEdit={handleUpdateCategory}
      onDelete={handleDeleteCategory}
      onReorder={() => Promise.resolve()}
    />
  );
};

export default CategoryListContainer;
