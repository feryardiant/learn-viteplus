import type { RouteRecordRaw } from 'vue-router'

import Home from './Home.vue'
import Other from './Other.vue'

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
