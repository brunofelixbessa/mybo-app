import { route } from "quasar/wrappers";
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory,
} from "vue-router";
import routes from "./routes";

import { useAuth } from "stores/auth";

export default route(function (/*{ store, ssrContext }*/) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === "history"
    ? createWebHistory
    : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(
      process.env.MODE === "ssr" ? void 0 : process.env.VUE_ROUTER_BASE
    ),
  });

  Router.beforeEach((to, from, next) => {
    const store = useAuth();
    if (
      to.matched.some((record) => record.meta.requerLogin) &&
      !store.isAuthenticated
    ) {
      next(
        {
          name: "login",
          query: { to: to.path },
        },
        console.log("Pagina segura")
      );
    } else next(console.log("Pagina livre"));
  });

  return Router;
});
