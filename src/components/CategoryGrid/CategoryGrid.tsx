import React from "react";
import { Grid } from "@mui/material";
import CategoryCard from "../CategoryCard/CategoryCard";
import { Category } from "../../types";
import styles from "./CategoryGrid.module.css";

interface CategoryGridProps {
  categories: Category[];
}

const CategoryGrid: React.FC<CategoryGridProps> = ({ categories }) => {
  return (
    <Grid container spacing={3} className={styles.grid}>
      {categories.map((category) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={category.id}>
          <CategoryCard category={category} />
        </Grid>
      ))}
    </Grid>
  );
};

export default CategoryGrid;
