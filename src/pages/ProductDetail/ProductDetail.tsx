import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { fetchProductById } from "../../reducers";
import styles from "./ProductDetail.module.css";

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const {
    selectedProduct: product,
    loading,
    error,
  } = useAppSelector((state) => state.products);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
    }
  }, [dispatch, id]);

  if (loading) {
    return <div className={styles.loading}>Загрузка...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  if (!product) {
    return <div className={styles.notFound}>Товар не найден</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.product}>
        <img src={product.image} alt={product.name} className={styles.image} />
        <div className={styles.info}>
          <h1 className={styles.title}>{product.name}</h1>
          <p className={styles.description}>{product.description}</p>
          <div className={styles.price}>{product.price} ₽</div>
          <div className={styles.stock}>В наличии: {product.stock} шт.</div>
          <div className={styles.category}>Категория: {product.category}</div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
