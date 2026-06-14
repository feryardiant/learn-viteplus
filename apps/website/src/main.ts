import { createApp } from './app'

import './style.css'

const { app, router } = createApp(import.meta.env.BASE_URL)

await router.isReady()

app.mount('#app')
