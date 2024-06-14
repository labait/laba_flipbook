import { createApp } from 'vue'
import { BootstrapIconsPlugin } from "bootstrap-icons-vue";
import './style.css'
import App from './App.vue'

import router from './router'

createApp(App)
.use(BootstrapIconsPlugin)
.use(router)
.mount('#app')
