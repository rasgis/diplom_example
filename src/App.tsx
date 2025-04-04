import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Layout from "./components/Layout/Layout";
import { useAppSelector } from "./hooks";
import { ROUTES } from "./constants/routes";

// Pages
import Home from "./pages/Home/Home";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import ProductList from "./pages/Admin/Products/ProductList";
import ProductCreate from "./pages/Admin/Products/ProductCreate";
import ProductEdit from "./pages/Admin/Products/ProductEdit";
import ProductCatalog from "./pages/ProductCatalog/ProductCatalog";
import ProductDetail from "./pages/ProductDetail/ProductDetail";
import CategoryPage from "./pages/CategoryPage/CategoryPage";
import AllProducts from "./pages/AllProducts";
import NotFound from "./pages/NotFound";
import CategoryListContainer from "./pages/Admin/Categories";
import Cart from "./pages/Cart/Cart";

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  return isAuthenticated ? <>{children}</> : <Navigate to={ROUTES.LOGIN} />;
};

const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  return isAuthenticated && user?.role === "admin" ? (
    <>{children}</>
  ) : (
    <Navigate to={ROUTES.HOME} />
  );
};

const App: React.FC = () => {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="app">
        <Layout>
          <Routes>
            <Route path={ROUTES.HOME} element={<Home />} />
            <Route path={ROUTES.LOGIN} element={<Login />} />
            <Route path={ROUTES.REGISTER} element={<Register />} />
            <Route path={ROUTES.CATALOG} element={<ProductCatalog />} />
            <Route path={ROUTES.CATEGORY} element={<CategoryPage />} />
            <Route path={ROUTES.PRODUCT_DETAIL} element={<ProductDetail />} />
            <Route path={ROUTES.ALL_PRODUCTS} element={<AllProducts />} />
            <Route path={ROUTES.CART} element={<Cart />} />
            <Route
              path={ROUTES.ADMIN.PRODUCTS}
              element={
                <AdminRoute>
                  <ProductList />
                </AdminRoute>
              }
            />
            <Route
              path={ROUTES.ADMIN.PRODUCT_CREATE}
              element={
                <AdminRoute>
                  <ProductCreate />
                </AdminRoute>
              }
            />
            <Route
              path={ROUTES.ADMIN.PRODUCT_EDIT}
              element={
                <AdminRoute>
                  <ProductEdit />
                </AdminRoute>
              }
            />
            <Route
              path={ROUTES.ADMIN.CATEGORIES}
              element={
                <AdminRoute>
                  <CategoryListContainer />
                </AdminRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </Router>
  );
};

export default App;
