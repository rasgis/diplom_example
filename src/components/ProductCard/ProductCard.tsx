import React from "react";
import { Link } from "react-router-dom";
import { Product } from "../../types/product";
import { ROUTES } from "../../constants/routes";
import { useAppSelector } from "../../hooks/redux";
import styles from "./ProductCard.module.css";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { items: categories } = useAppSelector((state) => state.categories);

  // Получаем название категории
  const categoryName =
    categories.find((cat) => cat.id === product.categoryId)?.name ||
    "Неизвестная категория";

  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        <img
          src={product.image}
          alt={product.name}
          className={styles.image}
          loading="lazy"
        />
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{product.name}</h3>
        <p className={styles.description}>{product.description}</p>
        <div className={styles.category}>{categoryName}</div>
        <div className={styles.price}>
          {product.price} ₽ / {product.unitOfMeasure}
        </div>
        <div className={styles.actions}>
          <Link
            to={ROUTES.PRODUCT_DETAIL.replace(":id", product.id)}
            className={styles.button}
          >
            Подробнее
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
