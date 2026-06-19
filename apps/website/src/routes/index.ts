import type { RouteRecordRaw } from 'vue-router'

import Home from './home.vue'
import Other from './other.vue'

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/other',
    name: 'Other',
    component: Other,
  },
]
