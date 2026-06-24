import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
// 引入路由

export const routes: Array<RouteRecordRaw> = [
  {
    name: "首页",
    path: "/",
    component: () => import("@/pages/home/index.vue"),
  },
  {
    name: "最热",
    path: "/tab/hot",
    component: () => import("@/pages/hot/index.vue"),
  },
  {
    name: "实时",
    path: "/tab/realtime",
    component: () => import("@/pages/realtime/index.vue"),
  },
  {
    name: "听广播",
    path: "/tab/radio",
    component: () => import("@/pages/radio/index.vue"),
  },
  {
    name: "基础设置",
    path: "/setting/base",
    component: () => import("@/pages/setting/base/index.vue"),
  },
  {
    name: "新闻设置",
    path: "/setting/news",
    component: () => import("@/pages/setting/news/index.vue"),
  },
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
