import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import { createProduct } from "../../../reducers";
import { fetchCategories } from "../../../reducers";
import { Product } from "../../../types/product";
import { Category } from "../../../types/category";
import styles from "./Admin.module.css";

const ProductCreate: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { items: categories } = useAppSelector((state) => state.categories);

  const [formData, setFormData] = useState<
    Omit<Product, "id" | "createdAt" | "updatedAt">
  >({
    name: "",
    description: "",
    price: 0,
    category: "",
    image: "",
    stock: 0,
  });

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(createProduct(formData)).unwrap();
      navigate("/admin/products");
    } catch (error) {
      console.error("Error creating product:", error);
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

  return (
    <div className={styles.adminContainer}>
      <div className={styles.header}>
        <h2>Создание нового товара</h2>
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
            onChange={handleChange}
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
            Создать товар
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

export default ProductCreate;
