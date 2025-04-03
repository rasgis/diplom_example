import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardMedia, Typography } from "@mui/material";
import { ROUTES } from "../../constants/routes";
import { Category } from "../../types";
import styles from "./CategoryCard.module.css";

interface CategoryCardProps {
  category: Category;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  return (
    <Link
      to={ROUTES.CATEGORY.replace(":categoryId", category.id)}
      className={styles.link}
    >
      <Card className={styles.card}>
        <CardMedia
          component="img"
          height="140"
          image={category.image || "/placeholder.jpg"}
          alt={category.name}
          className={styles.media}
        />
        <CardContent>
          <Typography gutterBottom variant="h6" component="div">
            {category.name}
          </Typography>
        </CardContent>
      </Card>
    </Link>
  );
};

export default CategoryCard;
