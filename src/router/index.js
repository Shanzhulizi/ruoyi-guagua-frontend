import { createRouter, createWebHistory } from "vue-router";
import Login from "../views/Login.vue";
import Home from "../views/Home.vue";
import Register from "../views/Register.vue";
import component from "element-plus/es/components/tree-select/src/tree-select-option.mjs";
import Seckill from "../views/Seckill.vue";
import CategoryProductList from "../views/CategoryProductList.vue";
import ProductDetail from "../views/ProductDetail.vue";
import CartPage from "../views/CartPage.vue";
import SearchResult from "../views/SearchResult.vue";
const routes = [
  { path: "/", redirect: "/login" },
  { path: "/login", component: Login },
  { path: "/home", component: Home },
  { path: "/register", component: Register },
  { path: "/seckill", component: Seckill },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/login", // 所有未定义的页面都重定向到登录页
  },
  { path: "/category/products", component: CategoryProductList },

  { path: "/product/:id", component: ProductDetail },

  { path: "/cart", component: CartPage },
  { path: "/search", component: SearchResult },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const whiteList = ["/login", "/register", "/forgot-password"];
// 路由守卫
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");

  // 如果路径在白名单中，直接放行
  if (whiteList.includes(to.path)) {
    return next();
  }

  // 如果没有 token，跳转到登录页
  if (!token) {
    return next("/login");
  }

  next();
});

export default router;
