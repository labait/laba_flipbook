import { createWebHistory, createRouter } from 'vue-router'

import HomeView from './views/HomeView.vue'
import FlipbookView from './views/FlipbookView.vue'

const routes = [
  { path: '/', component: HomeView, name: "home", },
  { path: '/detail/:folder', component: FlipbookView, name: "detail", },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router