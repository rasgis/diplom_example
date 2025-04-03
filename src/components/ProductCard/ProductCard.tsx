import React from "react";
import { Link } from "react-router-dom";
import { Product } from "../../types/product";
import { ROUTES } from "../../constants/routes";
import styles from "./ProductCard.module.css";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className={styles.card}>
      <img src={product.image} alt={product.name} className={styles.image} />
      <div className={styles.content}>
        <h3 className={styles.title}>{product.name}</h3>
        <p className={styles.description}>{product.description}</p>
        <div className={styles.price}>{product.price} ₽</div>
        <div className={styles.stock}>В наличии: {product.stock} шт.</div>
        <Link
          to={ROUTES.PRODUCT_DETAIL.replace(":id", product.id)}
          className={styles.button}
        >
          Подробнее
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
