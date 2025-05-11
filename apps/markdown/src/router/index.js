import { createRouter, createWebHistory } from 'vue-router'
import App from '../App.vue'
const routes = [
    {
        path: '/',
        name: 'app',
        component: App,
        children: [
            {
                path: '/markdown',
                name: 'markdown',
                component: () => import('../pages/markdown.vue')
            }
        ]
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router