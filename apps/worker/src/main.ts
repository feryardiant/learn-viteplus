import { createApp } from './app'

import '@learn-viteplus/frontend/style.css'

const { app, router } = createApp(import.meta.env.BASE_URL)

await router.isReady()

app.mount('#app')
