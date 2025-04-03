import React, { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Collapse,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from "@mui/icons-material";
import { Category } from "../../../types";
import CategoryForm from "./CategoryForm";
import { categoryService } from "../../../services/categoryService";

interface CategoryListProps {
  categories: Category[];
  onAdd: (
    category: Omit<
      Category,
      "id" | "slug" | "order" | "createdAt" | "updatedAt"
    >
  ) => Promise<void>;
  onEdit: (
    id: string,
    category: Omit<
      Category,
      "id" | "slug" | "order" | "createdAt" | "updatedAt"
    >
  ) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onReorder: (categories: Category[]) => Promise<void>;
}

const CategoryList: React.FC<CategoryListProps> = ({
  categories = [],
  onAdd,
  onEdit,
  onDelete,
  onReorder,
}) => {
  const [open, setOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(
    null
  );
  const [expandedCategories, setExpandedCategories] = useState<
    Record<string, boolean>
  >({});

  const handleAdd = (parentId?: string) => {
    setEditingCategory(null);
    setOpen(true);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setOpen(true);
  };

  const handleDelete = (category: Category) => {
    setDeletingCategory(category);
  };

  const handleConfirmDelete = async () => {
    if (deletingCategory) {
      await onDelete(deletingCategory.id);
      setDeletingCategory(null);
    }
  };

  const handleSubmit = async (
    category: Omit<
      Category,
      "id" | "slug" | "order" | "createdAt" | "updatedAt"
    >
  ) => {
    if (editingCategory) {
      await onEdit(editingCategory.id, category);
    } else {
      await onAdd(category);
    }
    setOpen(false);
  };

  const toggleExpand = (categoryId: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  // Строим дерево категорий
  const categoryTree = categoryService.buildCategoryTree(categories);

  // Рекурсивная функция для отображения категорий
  const renderCategoryRow = (category: Category, level: number = 0) => {
    const hasChildren = categories.some((c) => c.parentId === category.id);
    const isExpanded = expandedCategories[category.id] || false;

    return (
      <React.Fragment key={category.id}>
        <TableRow>
          <TableCell style={{ paddingLeft: `${level * 20}px` }}>
            {hasChildren && (
              <IconButton
                size="small"
                onClick={() => toggleExpand(category.id)}
                sx={{ mr: 1 }}
              >
                {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            )}
          </TableCell>
          <TableCell>
            {category.image && (
              <img
                src={category.image}
                alt={category.name}
                style={{
                  width: 50,
                  height: 50,
                  objectFit: "cover",
                }}
              />
            )}
          </TableCell>
          <TableCell>{category.name}</TableCell>
          <TableCell>{category.slug}</TableCell>
          <TableCell>
            <IconButton
              onClick={() => handleAdd(category.id)}
              color="primary"
              size="small"
              sx={{ mr: 1 }}
            >
              <AddIcon />
            </IconButton>
            <IconButton
              onClick={() => handleEdit(category)}
              color="primary"
              size="small"
              sx={{ mr: 1 }}
            >
              <EditIcon />
            </IconButton>
            <IconButton
              onClick={() => handleDelete(category)}
              color="error"
              size="small"
            >
              <DeleteIcon />
            </IconButton>
          </TableCell>
        </TableRow>
        {hasChildren && isExpanded && (
          <TableRow>
            <TableCell colSpan={5} style={{ padding: 0 }}>
              <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                <Box sx={{ p: 2 }}>
                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell width={50}></TableCell>
                          <TableCell>Изображение</TableCell>
                          <TableCell>Название</TableCell>
                          <TableCell>Slug</TableCell>
                          <TableCell>Действия</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {categories
                          .filter((c) => c.parentId === category.id)
                          .map((childCategory) =>
                            renderCategoryRow(childCategory, level + 1)
                          )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              </Collapse>
            </TableCell>
          </TableRow>
        )}
      </React.Fragment>
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h5" component="h2">
          Управление категориями
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleAdd()}
        >
          Добавить категорию
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell width={50}></TableCell>
              <TableCell>Изображение</TableCell>
              <TableCell>Название</TableCell>
              <TableCell>Slug</TableCell>
              <TableCell>Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categoryTree.length > 0 ? (
              categoryTree.map((category) => renderCategoryRow(category))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  Категории не найдены
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingCategory
            ? "Редактирование категории"
            : "Добавление категории"}
        </DialogTitle>
        <DialogContent>
          <CategoryForm
            category={editingCategory || undefined}
            categories={categories}
            onSubmit={handleSubmit}
            onCancel={() => setOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!deletingCategory}
        onClose={() => setDeletingCategory(null)}
      >
        <DialogTitle>Подтверждение удаления</DialogTitle>
        <DialogContent>
          <Typography>
            Вы уверены, что хотите удалить категорию "{deletingCategory?.name}"?
            Это действие нельзя отменить.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeletingCategory(null)}>Отмена</Button>
          <Button onClick={handleConfirmDelete} color="error">
            Удалить
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CategoryList;
