import {createRouter, createWebHistory} from "vue-router";
import HomeView from "../views/HomeView.vue";
import Home2View from "../views/Home2View.vue";

export const routes: any = [

    {
        path: '/',
        component: HomeView,
    },
    {
        path: '/2',
        component: Home2View,
    }
]


const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

export default router
