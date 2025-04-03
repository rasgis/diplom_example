import React, { useEffect } from "react";
import { Container, Typography, Box } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { fetchCategories } from "../../reducers/categorySlice";
import CategoryGrid from "../../components/CategoryGrid/CategoryGrid";
import { Category } from "../../types";
import { categoryService } from "../../services/categoryService";

const ProductCatalog: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    items: categories,
    loading: categoriesLoading,
    error: categoriesError,
  } = useAppSelector((state) => state.categories);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  if (categoriesLoading) {
    return (
      <Container>
        <Typography>Загрузка...</Typography>
      </Container>
    );
  }

  if (categoriesError) {
    return (
      <Container>
        <Typography color="error">{categoriesError}</Typography>
      </Container>
    );
  }

  const rootCategories = categoryService.buildCategoryTree(categories);

  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Каталог товаров
        </Typography>

        {rootCategories.length === 0 ? (
          <Typography>Категории не найдены</Typography>
        ) : (
          <Box sx={{ mb: 4 }}>
            <CategoryGrid categories={rootCategories} />
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default ProductCatalog;
