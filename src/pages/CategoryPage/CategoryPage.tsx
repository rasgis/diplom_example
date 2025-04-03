import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Grid,
  Breadcrumbs,
  Link as MuiLink,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { fetchCategories } from "../../reducers/categorySlice";
import { fetchProducts } from "../../reducers/productSlice";
import CategoryGrid from "../../components/CategoryGrid/CategoryGrid";
import ProductCard from "../../components/ProductCard/ProductCard";
import { ROUTES } from "../../constants/routes";
import { Category, Product } from "../../types";

const CategoryPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const dispatch = useAppDispatch();
  const {
    items: categories,
    loading: categoriesLoading,
    error: categoriesError,
  } = useAppSelector((state) => state.categories);
  const {
    items: products,
    loading: productsLoading,
    error: productsError,
  } = useAppSelector((state) => state.products);

  useEffect(() => {
    if (categoryId) {
      dispatch(fetchCategories());
      dispatch(fetchProducts());
    }
  }, [dispatch, categoryId]);

  if (categoriesLoading || productsLoading) {
    return (
      <Container>
        <Typography>Загрузка...</Typography>
      </Container>
    );
  }

  if (categoriesError || productsError) {
    return (
      <Container>
        <Typography color="error">
          {categoriesError || productsError}
        </Typography>
      </Container>
    );
  }

  const currentCategory = categories.find(
    (category: Category) => category.id === categoryId
  );

  if (!currentCategory) {
    return (
      <Container>
        <Typography>Категория не найдена</Typography>
      </Container>
    );
  }

  // Фильтруем только подкатегории текущей категории
  const subcategories = categories.filter(
    (category: Category) => category.parentId === categoryId
  );

  // Фильтруем продукты текущей категории
  const categoryProducts = products.filter(
    (product: Product) => product.categoryId === categoryId
  );

  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
          <MuiLink component={Link} to={ROUTES.CATALOG} color="inherit">
            Каталог
          </MuiLink>
          <Typography color="text.primary">{currentCategory.name}</Typography>
        </Breadcrumbs>

        <Typography variant="h4" component="h1" gutterBottom>
          {currentCategory.name}
        </Typography>

        {subcategories.length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" component="h2" gutterBottom>
              Подкатегории
            </Typography>
            <CategoryGrid categories={subcategories} />
          </Box>
        )}

        {categoryProducts.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" component="h2" gutterBottom>
              Товары в категории
            </Typography>
            <Grid container spacing={3}>
              {categoryProducts.map((product: Product) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                  <ProductCard product={product} />
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {subcategories.length === 0 && categoryProducts.length === 0 && (
          <Typography>В данной категории нет подкатегорий и товаров</Typography>
        )}
      </Box>
    </Container>
  );
};

export default CategoryPage;
