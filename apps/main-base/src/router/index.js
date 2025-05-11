import { createRouter, createWebHistory } from 'vue-router';
import SubAppContainer from '../components/SubAppContainer.vue';
// import App from '@/App.vue';
import Home from '@/pages/home.vue';
import Workspace from '@/pages/workspace.vue';
const routes = [
  {
    path: '/',
    redirect: 'file',
    children: [
      {
        path: '/workspace',
        name: 'workspace',
        component: Workspace,
      },
      {
        path: '/file', // 匹配所有子应用路由
        name: 'file',
        component: Home, // 空容器组件
        children: [
          {
            path: 'markdown/:pathMatch(.*)*', // 匹配所有子应用路由
            name: 'markdown',
            component: SubAppContainer, // 空容器组件
          },
        ],
      },
      {
        path: '/lume',
        name: 'lume',
        component: SubAppContainer, // 空容器组件
      },
      {
        path: '/dynaload',
        name: 'dynaload',
        component: SubAppContainer,
      },
      {
        path: '/meta',
        name: 'meta',
        component: SubAppContainer,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
