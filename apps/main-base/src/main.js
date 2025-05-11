import { createApp } from 'vue';
import '@/assets/global.less';
import App from './App.vue';
import router from './router/index';
import microApp from '@micro-zoe/micro-app';
import { createPinia } from 'pinia';
const store = createPinia();
const app = createApp(App);
app.use(store).use(router).use(microApp);

app.mount(document.querySelector('#app'));

microApp.start({
  fetch(url, options, appName) {
    if (process.env.NODE_ENV !== 'electron') {
      return window.fetch(url, Object.assign(options)).then((res) => {
        return res.text();
      });
    } else {
      url = url.replace('http://localhost:9999', window.electronAPI.__dirname);
      console.log(url, 'micro-app-start');
      return window.electronAPI.file.readFile(url).then((res) => {
        console.log(res, 'micro-app-start');
        return res.content;
      });
    }
  },
});
