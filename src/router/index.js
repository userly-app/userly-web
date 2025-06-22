import { createRouter, createWebHistory } from "vue-router";

export function createAppRouter() {
    const router = createRouter({
        history: createWebHistory(),
        routes: [
            {
                path: '/',
                redirect: '/home' // Añadir redirección a home
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
                path: '/:pathMatch(.*)*', // Ruta para manejar 404
                redirect: '/home'
            }
        ]
    });

    // Corregir el guardia para llamar a next()
    router.beforeEach((to, from, next) => {
        // Actualizar el título
        let baseTitle = 'Users Management';
        document.title = `${baseTitle} | ${to.meta.title || 'App'}`;
        next(); // Es crucial llamar a next() para continuar la navegación
    });

    return router;
}