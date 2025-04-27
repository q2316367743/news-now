import { createApp } from 'vue'
import { createPinia } from 'pinia';
import App from './App.vue'
import {router} from './plugin/router';

import 'virtual:uno.css'
import 'tdesign-vue-next/es/style/index.css';
import '@/assets/style/global.less';

// 额外引入图标库
createApp(App)
  .use(createPinia())
  .use(router)
  .mount('#app');
