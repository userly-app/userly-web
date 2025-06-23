import { createRouter, createWebHistory } from "vue-router";

export function createAppRouter() {
    const router = createRouter({
        history: createWebHistory(),
        routes: [
            {
                path: '/',
                redirect: '/home'
            },
            {
                path: '/home',
                name: 'home',
                component: () => import('../home/pages/home.component.vue'),
                meta: {
                    title: 'Home'
                }
            },
            {
                path: '/user',
                name: 'user',
                component: () => import('@/user/pages/user-list.component.vue'),
                meta: {
                    title: 'Users'
                }
            },
            {
                path: '/:pathMatch(.*)*',
                redirect: '/home'
            }
        ]
    });

    router.beforeEach((to, from, next) => {
        let baseTitle = 'Users Management';
        document.title = `${baseTitle} | ${to.meta.title || 'App'}`;
        next();
    });

    return router;
}