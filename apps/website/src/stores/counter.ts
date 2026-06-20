import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', {
  state: () => ({
    count: 0,
  }),

  actions: {
    async fetchCount() {
      if (import.meta.env.SSR) return

      this.count = await apiCounter('GET')
    },

    async increment() {
      if (import.meta.env.SSR) return

      this.count = await apiCounter('PUT')
    },

    async reset() {
      if (import.meta.env.SSR) return

      this.count = await apiCounter('DELETE')
    },
  },
})

async function apiCounter(method: 'GET' | 'PUT' | 'DELETE'): Promise<number> {
  try {
    const { count } = await fetch('/api/counter', { method }).then((res) => res.json())

    return count
  } catch {
    return 0
  }
}
