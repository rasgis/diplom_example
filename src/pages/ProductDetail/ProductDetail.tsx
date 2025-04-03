import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { fetchProductById } from "../../reducers/productSlice";
import { fetchCategories } from "../../reducers/categorySlice";
import {
  Container,
  Typography,
  Box,
  Grid,
  Breadcrumbs,
  Link as MuiLink,
} from "@mui/material";
import { ROUTES } from "../../constants/routes";
import { categoryService } from "../../services/categoryService";
import styles from "./ProductDetail.module.css";

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const {
    selectedProduct: product,
    loading: productLoading,
    error: productError,
  } = useAppSelector((state) => state.products);
  const {
    items: categories,
    loading: categoriesLoading,
    error: categoriesError,
  } = useAppSelector((state) => state.categories);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
    }
    dispatch(fetchCategories());
  }, [dispatch, id]);

  if (productLoading || categoriesLoading) {
    return (
      <Container>
        <Typography>Загрузка...</Typography>
      </Container>
    );
  }

  if (productError || categoriesError) {
    return (
      <Container>
        <Typography color="error">{productError || categoriesError}</Typography>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container>
        <Typography>Товар не найден</Typography>
      </Container>
    );
  }

  // Получаем категорию товара
  const productCategory = categories.find(
    (category) => category.id === product.categoryId
  );

  // Получаем полный путь категории
  const categoryPath = categoryService.getCategoryPath(
    categories,
    product.categoryId
  );

  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
          <MuiLink component={Link} to={ROUTES.CATALOG} color="inherit">
            Каталог
          </MuiLink>
          {categoryPath.map((category, index) => {
            const isLast = index === categoryPath.length - 1;
            return isLast ? (
              <Typography key={category.id} color="text.primary">
                {category.name}
              </Typography>
            ) : (
              <MuiLink
                key={category.id}
                component={Link}
                to={`${ROUTES.CATEGORY.replace(":categoryId", category.id)}`}
                color="inherit"
              >
                {category.name}
              </MuiLink>
            );
          })}
          <Typography color="text.primary">{product.name}</Typography>
        </Breadcrumbs>

        <div className={styles.container}>
          <div className={styles.product}>
            <img
              src={product.image}
              alt={product.name}
              className={styles.image}
            />
            <div className={styles.info}>
              <h1 className={styles.title}>{product.name}</h1>
              <p className={styles.description}>{product.description}</p>
              <div className={styles.price}>
                {product.price} ₽ / {product.unitOfMeasure}
              </div>
              {productCategory && (
                <div className={styles.category}>
                  Категория: {productCategory.name}
                </div>
              )}
            </div>
          </div>
        </div>
      </Box>
    </Container>
  );
};

export default ProductDetail;
