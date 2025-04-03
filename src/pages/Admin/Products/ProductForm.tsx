import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import {
  createProduct,
  updateProduct,
  fetchProductById,
} from "../../../reducers";
import { ROUTES } from "../../../constants/routes";
import { CATEGORIES } from "../../../constants/categories";
import styles from "./Admin.module.css";

const validationSchema = Yup.object({
  name: Yup.string().required("Название товара обязательно"),
  description: Yup.string().required("Описание товара обязательно"),
  price: Yup.number()
    .positive("Цена должна быть положительным числом")
    .required("Цена обязательна"),
  category: Yup.string().required("Категория обязательна"),
  image: Yup.string().required("URL изображения обязателен"),
  stock: Yup.number()
    .integer("Количество должно быть целым числом")
    .min(0, "Количество не может быть отрицательным")
    .required("Количество обязательно"),
});

const ProductForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const {
    selectedProduct: product,
    loading,
    error,
  } = useAppSelector((state) => state.products);

  const isEdit = id !== "create";

  useEffect(() => {
    if (isEdit && id) {
      dispatch(fetchProductById(id));
    }
  }, [dispatch, isEdit, id]);

  const formik = useFormik({
    initialValues: {
      name: product?.name || "",
      description: product?.description || "",
      price: product?.price || "",
      category: product?.category || "",
      image: product?.image || "",
      stock: product?.stock || "",
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        if (isEdit && id) {
          await dispatch(updateProduct({ id, product: values })).unwrap();
        } else {
          await dispatch(createProduct(values)).unwrap();
        }
        navigate(ROUTES.ADMIN.PRODUCTS);
      } catch (error) {
        console.error("Error saving product:", error);
      }
    },
  });

  if (loading) {
    return <div className={styles.loading}>Загрузка...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.adminContainer}>
      <div className={styles.header}>
        <h2>{isEdit ? "Редактирование товара" : "Добавление товара"}</h2>
      </div>

      <form onSubmit={formik.handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="name">Название</label>
          <input
            id="name"
            name="name"
            type="text"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.name}
            className={
              formik.touched.name && formik.errors.name ? styles.error : ""
            }
          />
          {formik.touched.name && formik.errors.name && (
            <div className={styles.errorMessage}>{formik.errors.name}</div>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="description">Описание</label>
          <textarea
            id="description"
            name="description"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.description}
            className={
              formik.touched.description && formik.errors.description
                ? styles.error
                : ""
            }
          />
          {formik.touched.description && formik.errors.description && (
            <div className={styles.errorMessage}>
              {formik.errors.description}
            </div>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="price">Цена</label>
          <input
            id="price"
            name="price"
            type="number"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.price}
            className={
              formik.touched.price && formik.errors.price ? styles.error : ""
            }
          />
          {formik.touched.price && formik.errors.price && (
            <div className={styles.errorMessage}>{formik.errors.price}</div>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="category">Категория</label>
          <select
            id="category"
            name="category"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.category}
            className={
              formik.touched.category && formik.errors.category
                ? styles.error
                : ""
            }
          >
            <option value="">Выберите категорию</option>
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          {formik.touched.category && formik.errors.category && (
            <div className={styles.errorMessage}>{formik.errors.category}</div>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="image">URL изображения</label>
          <input
            id="image"
            name="image"
            type="text"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.image}
            className={
              formik.touched.image && formik.errors.image ? styles.error : ""
            }
          />
          {formik.touched.image && formik.errors.image && (
            <div className={styles.errorMessage}>{formik.errors.image}</div>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="stock">Количество в наличии</label>
          <input
            id="stock"
            name="stock"
            type="number"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.stock}
            className={
              formik.touched.stock && formik.errors.stock ? styles.error : ""
            }
          />
          {formik.touched.stock && formik.errors.stock && (
            <div className={styles.errorMessage}>{formik.errors.stock}</div>
          )}
        </div>

        <div className={styles.formActions}>
          <button type="submit" className={styles.submitButton}>
            {isEdit ? "Сохранить изменения" : "Добавить товар"}
          </button>
          <button
            type="button"
            onClick={() => navigate(ROUTES.ADMIN.PRODUCTS)}
            className={styles.cancelButton}
          >
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
