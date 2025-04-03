import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { Category } from "../../../types/category";
import ImageUpload from "../../../components/ImageUpload/ImageUpload";
import { fileService } from "../../../services/fileService";
import styles from "./CategoryForm.module.css";

interface CategoryFormProps {
  category?: Category;
  categories: Category[];
  onSubmit: (data: Omit<Category, "id" | "createdAt" | "updatedAt">) => void;
  onCancel: () => void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({
  category,
  categories,
  onSubmit,
  onCancel,
}) => {
  const [name, setName] = useState("");
  const [parentId, setParentId] = useState<string | undefined>(undefined);
  const [image, setImage] = useState<File | null>(null);
  const [imagePath, setImagePath] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (category) {
      setName(category.name);
      setParentId(category.parentId);
      setImagePath(category.image || undefined);
    }
  }, [category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      let finalImagePath = imagePath || "";

      if (image) {
        console.log("Uploading image:", image);
        finalImagePath = await fileService.saveImage(image);
        console.log("Image uploaded successfully:", finalImagePath);
      }

      const categoryData = {
        name,
        image: finalImagePath,
        slug: name.toLowerCase().replace(/\s+/g, "-"),
        order: category?.order || 0,
        parentId: parentId || undefined,
      };

      console.log("Submitting category data:", categoryData);
      onSubmit(categoryData);
    } catch (error) {
      console.error("Error saving category:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Произошла ошибка при сохранении категории"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageSelect = (file: File) => {
    console.log("Image selected:", file);
    setImage(file);
  };

  // Фильтруем категории, чтобы исключить текущую категорию и её подкатегории
  const availableParentCategories = categories.filter((c) => {
    if (category && c.id === category.id) return false;
    return true;
  });

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <TextField
        fullWidth
        label="Название категории"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        margin="normal"
      />

      <FormControl fullWidth margin="normal">
        <InputLabel id="parent-category-label">
          Родительская категория
        </InputLabel>
        <Select
          labelId="parent-category-label"
          value={parentId || ""}
          onChange={(e) => setParentId(e.target.value || undefined)}
          label="Родительская категория"
        >
          <MenuItem value="">
            <em>Нет (корневая категория)</em>
          </MenuItem>
          {availableParentCategories.map((cat) => (
            <MenuItem key={cat.id} value={cat.id}>
              {cat.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <ImageUpload onImageSelect={handleImageSelect} currentImage={imagePath} />

      {error && <Box sx={{ color: "error.main", mt: 1 }}>{error}</Box>}

      <Box className={styles.actions}>
        <Button type="button" onClick={onCancel} disabled={isLoading}>
          Отмена
        </Button>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={isLoading}
        >
          {isLoading ? "Сохранение..." : "Сохранить"}
        </Button>
      </Box>
    </form>
  );
};

export default CategoryForm;
