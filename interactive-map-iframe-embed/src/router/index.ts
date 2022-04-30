import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
//import MapPage from '../views/MapPage.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
    {
        path: '/:id',
        name: 'MapRenderer',
        component: () => import("@/views/MapPage.vue")
    },
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
});

export default router
