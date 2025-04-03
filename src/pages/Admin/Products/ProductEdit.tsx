import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import {
  updateProduct,
  fetchProductById,
  fetchCategories,
} from "../../../reducers";
import { Product } from "../../../types/product";
import { Category } from "../../../types/category";
import styles from "./Admin.module.css";

const ProductEdit: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { selectedProduct, loading: productLoading } = useAppSelector(
    (state) => state.products
  );
  const { items: categories } = useAppSelector((state) => state.categories);

  const [formData, setFormData] = useState<Partial<Product>>({
    name: "",
    description: "",
    price: 0,
    category: "",
    image: "",
    stock: 0,
  });

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
    }
    dispatch(fetchCategories());
  }, [dispatch, id]);

  useEffect(() => {
    if (selectedProduct) {
      setFormData({
        name: selectedProduct.name,
        description: selectedProduct.description,
        price: selectedProduct.price,
        category: selectedProduct.category,
        image: selectedProduct.image,
        stock: selectedProduct.stock,
      });
    }
  }, [selectedProduct]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    try {
      await dispatch(updateProduct({ id, product: formData })).unwrap();
      navigate("/admin/products");
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" || name === "stock" ? Number(value) : value,
    }));
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const categoryId = e.target.value;
    setFormData((prev: Partial<Product>) => ({
      ...prev,
      categoryId: categoryId ? parseInt(categoryId) : undefined,
    }));
  };

  if (productLoading) {
    return <div className={styles.loading}>Загрузка...</div>;
  }

  if (!selectedProduct) {
    return <div className={styles.error}>Товар не найден</div>;
  }

  return (
    <div className={styles.adminContainer}>
      <div className={styles.header}>
        <h2>Редактирование товара</h2>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="name">Название</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="description">Описание</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="price">Цена</label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            min="0"
            step="0.01"
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="category">Категория</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleCategoryChange}
            required
          >
            <option value="">Выберите категорию</option>
            {categories.map((category: Category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="image">URL изображения</label>
          <input
            type="text"
            id="image"
            name="image"
            value={formData.image}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="stock">Количество в наличии</label>
          <input
            type="number"
            id="stock"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            min="0"
            required
          />
        </div>

        <div className={styles.formActions}>
          <button type="submit" className={styles.submitButton}>
            Сохранить изменения
          </button>
          <button
            type="button"
            onClick={() => navigate("/admin/products")}
            className={styles.cancelButton}
          >
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductEdit;
