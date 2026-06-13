import { createPinia } from 'pinia'
import { createSSRApp } from 'vue'
import { createMemoryHistory, createRouter as createVueRouter, createWebHistory } from 'vue-router'

import App from './App.vue'
import { routes } from './routes'

export function createApp(base?: string) {
  const app = createSSRApp(App)

  const router = createRouter(base)

  app.use(router)
  app.use(createPinia())

  return { app, router }
}

export function createRouter(base?: string) {
  const router = createVueRouter({
    history: typeof window === 'undefined' ? createMemoryHistory(base) : createWebHistory(base),
    routes,
  })

  return router
}
