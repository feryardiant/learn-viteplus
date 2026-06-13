import { createPinia } from 'pinia'
import { createSSRApp } from 'vue'
import { createMemoryHistory, createRouter, createWebHistory } from 'vue-router'

import App from './App.vue'
import { routes } from './routes'

export function createApp() {
  const app = createSSRApp(App)

  const router = createRouter({
    history: typeof window === 'undefined' ? createMemoryHistory() : createWebHistory(import.meta.env.BASE_URL),
    routes,
  })

  app.use(router)
  app.use(createPinia())

  return app
}
