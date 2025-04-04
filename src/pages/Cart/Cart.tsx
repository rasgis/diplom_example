import React from "react";
import { useAppSelector, useAppDispatch } from "../../hooks";
import {
  removeFromCart,
  updateQuantity,
  clearCart,
} from "../../reducers/cartSlice";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import styles from "./Cart.module.css";

const Cart: React.FC = () => {
  const { items, total } = useAppSelector((state) => state.cart);
  const { items: categories } = useAppSelector((state) => state.categories);
  const dispatch = useAppDispatch();

  const handleQuantityChange = (id: string, quantity: number) => {
    if (quantity < 1) return;
    dispatch(updateQuantity({ id, quantity }));
  };

  const handleRemoveItem = (id: string) => {
    dispatch(removeFromCart(id));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  // Получаем название категории по ID
  const getCategoryName = (categoryId: string) => {
    return (
      categories.find((cat) => cat.id === categoryId)?.name ||
      "Неизвестная категория"
    );
  };

  if (items.length === 0) {
    return (
      <div className={styles.emptyCart}>
        <h2>Корзина пуста</h2>
        <p>Добавьте товары в корзину, чтобы оформить заказ</p>
      </div>
    );
  }

  return (
    <div className={styles.cart}>
      <h2>Корзина</h2>
      <div className={styles.cartItems}>
        {items.map((item) => (
          <div key={item.id} className={styles.cartItem}>
            <img
              src={item.image}
              alt={item.name}
              className={styles.itemImage}
            />
            <div className={styles.itemInfo}>
              <h3>{item.name}</h3>
              <p className={styles.category}>
                {getCategoryName(item.categoryId)}
              </p>
              <p className={styles.price}>{item.price} ₽</p>
            </div>
            <div className={styles.quantity}>
              <button
                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                className={styles.quantityButton}
              >
                <RemoveIcon fontSize="small" />
              </button>
              <span>{item.quantity}</span>
              <button
                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                className={styles.quantityButton}
              >
                <AddIcon fontSize="small" />
              </button>
            </div>
            <button
              onClick={() => handleRemoveItem(item.id)}
              className={styles.removeButton}
            >
              Удалить
            </button>
          </div>
        ))}
      </div>
      <div className={styles.cartSummary}>
        <div className={styles.total}>
          <span>Итого:</span>
          <span>{total} ₽</span>
        </div>
        <div className={styles.actions}>
          <button onClick={handleClearCart} className={styles.clearButton}>
            Очистить корзину
          </button>
          <button className={styles.checkoutButton}>Оформить заказ</button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
