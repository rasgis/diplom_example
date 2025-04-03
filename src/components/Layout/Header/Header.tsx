import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import { logoutUser } from "../../../reducers/authSlice";
import { ROUTES } from "../../../constants/routes";
import styles from "./Header.module.css";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";

const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const { items } = useAppSelector((state) => state.cart);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate(ROUTES.HOME);
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.leftSection}>
          <Link to={ROUTES.HOME} className={styles.logo}>
            Строительный магазин
          </Link>

          <nav className={styles.nav}>
            <Link to={ROUTES.CATALOG} className={styles.navLink}>
              Каталог
            </Link>
          </nav>
        </div>

        <div className={styles.rightSection}>
          {user?.role === "admin" && (
            <div className={styles.adminNav}>
              <Link to={ROUTES.ADMIN.PRODUCTS} className={styles.adminLink}>
                <AdminPanelSettingsIcon />
                Товары
              </Link>
              <Link to={ROUTES.ADMIN.CATEGORIES} className={styles.adminLink}>
                <AdminPanelSettingsIcon />
                Категории
              </Link>
            </div>
          )}

          <div className={styles.cart}>
            <Link to="/cart" className={styles.cartLink}>
              Корзина ({items.length})
            </Link>
          </div>

          <div className={styles.auth}>
            {isAuthenticated ? (
              <div className={styles.userInfo}>
                <PersonIcon className={styles.userIcon} />
                <span className={styles.userName}>
                  {user?.name || "Пользователь"}
                </span>
                <button onClick={handleLogout} className={styles.logoutButton}>
                  <LogoutIcon />
                </button>
              </div>
            ) : (
              <div className={styles.authLinks}>
                <Link to={ROUTES.LOGIN} className={styles.authLink}>
                  Войти
                </Link>
                <Link to={ROUTES.REGISTER} className={styles.authLink}>
                  Регистрация
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
