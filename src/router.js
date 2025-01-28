import { createWebHistory, createMemoryHistory, createRouter } from 'vue-router'
import HomeView from './views/HomeView.vue'
import FlipbookView from './views/FlipbookView.vue'

const routes = [
  { path: '/', component: HomeView, name: "home", },
  { path: '/detail/:folder', component: FlipbookView, name: "detail", },
]

import { useGlobal } from './global.js'
const global = useGlobal()  
console.log('isEmbed', global.dataAttributes.value.isEmbed)

const router = createRouter({
  history: (global.dataAttributes.value.isEmbed == 'true' ? createMemoryHistory() : createWebHistory()),
  routes,
})

export default router