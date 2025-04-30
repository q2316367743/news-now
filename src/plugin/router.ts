import {createRouter, createWebHashHistory, RouteRecordRaw} from 'vue-router';
// 引入路由

export const routes: Array<RouteRecordRaw> = [{
  name: '首页',
  path: '/',
  component: () => import('@/pages/home/index.vue'),
}, {
  name: '关注',
  path: '/tab/focus',
  component: () => import('@/pages/focus/index.vue'),
}, {
  name: "最热",
  path: '/tab/hot',
  component: () => import('@/pages/hot/index.vue'),
}, {
  name: '实时',
  path: '/tab/realtime',
  component: () => import('@/pages/realtime/index.vue'),
}, {
  name: 'RSS',
  path: '/tab/rss',
  component: () => import('@/pages/rss/index.vue'),
}];

export const router = createRouter({
  history: createWebHashHistory(),
  routes
});

