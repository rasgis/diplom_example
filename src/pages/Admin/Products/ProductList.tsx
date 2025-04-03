import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { fetchProducts, deleteProduct } from "../../../reducers/productSlice";
import { fetchCategories } from "../../../reducers/categorySlice";
import { ROUTES } from "../../../constants/routes";
import Modal from "../../../components/Modal/Modal";
import styles from "./Admin.module.css";

const ProductList: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    items: products,
    loading,
    error,
  } = useAppSelector((state) => state.products);
  const { items: categories } = useAppSelector((state) => state.categories);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleDeleteClick = (productId: string) => {
    setProductToDelete(productId);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (productToDelete) {
      try {
        await dispatch(deleteProduct(productToDelete)).unwrap();
        setIsDeleteModalOpen(false);
        setProductToDelete(null);
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
    setProductToDelete(null);
  };

  // Функция для получения названия категории по ID
  const getCategoryName = (categoryId: string) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : "Неизвестная категория";
  };

  if (loading) {
    return <div className={styles.loading}>Загрузка...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  if (!products || products.length === 0) {
    return <div className={styles.empty}>Товары не найдены</div>;
  }

  return (
    <div className={styles.adminContainer}>
      <div className={styles.header}>
        <h2>Управление товарами</h2>
        <Link to={ROUTES.ADMIN.PRODUCT_CREATE} className={styles.addButton}>
          Добавить товар
        </Link>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Изображение</th>
              <th>Название</th>
              <th>Категория</th>
              <th>Цена</th>
              <th>Единица измерения</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>
                  <img
                    src={product.image}
                    alt={product.name}
                    className={styles.productImage}
                  />
                </td>
                <td>{product.name}</td>
                <td>{getCategoryName(product.categoryId)}</td>
                <td>{product.price} ₽</td>
                <td>{product.unitOfMeasure}</td>
                <td>
                  <div className={styles.actions}>
                    <Link
                      to={ROUTES.ADMIN.PRODUCT_EDIT.replace(":id", product.id)}
                      className={styles.editButton}
                    >
                      Редактировать
                    </Link>
                    <button
                      onClick={() => handleDeleteClick(product.id)}
                      className={styles.deleteButton}
                    >
                      Удалить
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Подтверждение удаления"
      >
        <p>Вы уверены, что хотите удалить этот товар?</p>
        <p>Это действие нельзя отменить.</p>
      </Modal>
    </div>
  );
};

export default ProductList;
