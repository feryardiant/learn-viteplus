import { createPinia } from 'pinia'
import { createSSRApp } from 'vue'
import { createMemoryHistory, createRouter, createWebHistory } from 'vue-router'

import App from './App.vue'
import { routes } from './routes'

export function createApp(base?: string) {
  const app = createSSRApp(App)

  const router = createRouter({
    history: typeof window === 'undefined' ? createMemoryHistory(base) : createWebHistory(base),
    routes,
  })

  app.use(router)
  app.use(createPinia())

  return { app, router }
}
