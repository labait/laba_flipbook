import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

// add router
import router from './router'


//createApp(App).mount('#app')
createApp(App)
.use(router)
.mount('#app')
