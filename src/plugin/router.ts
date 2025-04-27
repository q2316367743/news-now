import {createRouter, createWebHashHistory, RouteRecordRaw} from 'vue-router';
import {HomeIcon} from 'tdesign-icons-vue-next';
// 引入路由

export const routes: Array<RouteRecordRaw> = [{
  name: "主页",
  path: '/home',
  alias: ['/'],
  component: () => import('@/pages/home/index.vue'),
  meta: {
    icon: HomeIcon,
  }
}];

export const router = createRouter({
  history: createWebHashHistory(),
  routes
});

