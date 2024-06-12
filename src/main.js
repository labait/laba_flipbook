import { createApp } from 'vue'
import { BootstrapIconsPlugin } from "bootstrap-icons-vue";
import './style.css'
import App from './App.vue'

import router from './router'

import {
  BIconBatteryFull,
  BIconArrow90degDown,
  BIconBookmark,
} from "bootstrap-icons-vue";

createApp(App)
.use(BootstrapIconsPlugin)
.use(router)
.mount('#app')
