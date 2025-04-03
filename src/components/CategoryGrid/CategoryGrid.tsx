import React from "react";
import { Grid, Box } from "@mui/material";
import CategoryCard from "../CategoryCard/CategoryCard";
import { Category } from "../../types";
import styles from "./CategoryGrid.module.css";

interface CategoryGridProps {
  categories: Category[];
}

const CategoryGrid: React.FC<CategoryGridProps> = ({ categories }) => {
  return (
    <Box className={styles.gridContainer}>
      <Grid container spacing={3} justifyContent="center">
        {categories.map((category) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
            key={category.id}
            className={styles.gridItem}
          >
            <CategoryCard category={category} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default CategoryGrid;
