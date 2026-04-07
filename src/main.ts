import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useAuthStore } from '@/stores/authStore'

import './assets/main.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// Initialize Auth Listener before launching app so user is logged in
const authStore = useAuthStore()
authStore.initAuthListener()
  .then(() => {
    console.log("Auth listener initialized, mounting app...");
    app.mount('#app')
  })
  .catch((err) => {
    console.error("Failed to initialize auth listener:", err);
    // Mount anyway so UI shows (maybe in guest mode)
    app.mount('#app')
  })
