export const ROUTES = {
  HOME: "/",
  PRODUCTS: "/products",
  PRODUCT_DETAIL: "/products/:id",
  CART: "/cart",
  LOGIN: "/login",
  REGISTER: "/register",
  CATALOG: "/catalog",
  CATEGORY: "/catalog/:categoryId",
  ADMIN: {
    PRODUCTS: "/admin/products",
    PRODUCT_EDIT: "/admin/products/:id",
    PRODUCT_CREATE: "/admin/products/create",
    CATEGORIES: "/admin/categories",
  },
} as const;
