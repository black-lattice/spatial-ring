import './assets/styles/global.less'

import { createApp } from 'vue'
import router from './router/index.js'
import ArcoVue from '@arco-design/web-vue';
import '@arco-design/web-vue/dist/arco.css';
import { createPinia } from 'pinia'

import App from './App.vue'
const store = createPinia()

let app = null
// 👇 将渲染操作放入 mount 函数，子应用初始化时会自动执行
window.mount = () => {
  app = createApp(App)
  app.use(store)
    .use(router)
    .use(ArcoVue)
    .mount('#app')
}

// 👇 将卸载操作放入 unmount 函数，就是上面步骤2中的卸载函数
window.unmount = () => {
  app.unmount()
  app = null
}

// 如果不在微前端环境，则直接执行mount渲染
if (!window.__MICRO_APP_ENVIRONMENT__) {
  window.mount()
}