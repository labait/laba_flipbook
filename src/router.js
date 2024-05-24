import { createMemoryHistory, createRouter } from 'vue-router'

import HomeView from './views/HomeView.vue'
import FlipbookView from './views/FlipbookView.vue'

const routes = [
  { path: '/', component: HomeView, name: "root", },
  { path: '/flipbook', component: FlipbookView, name: "flipbook", },
]

const router = createRouter({
  history: createMemoryHistory(),
  routes,
})

export default router