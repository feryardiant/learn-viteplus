import { createApp } from './app'

import './style.css'

const { app } = createApp(import.meta.env.BASE_URL)

app.mount('#app')
