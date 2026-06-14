# The Website

Vue 3 website with SSR via Cloudflare Pages Functions, styled with TailwindCSS v4.

## Tech stack

- **Framework**: Vue 3 with Composition API + `<script setup>`
- **Routing**: vue-router 5 (HashHistory in dev, WebHistory in prod)
- **State**: Pinia (counter example)
- **Rendering**: SSR via `@cloudflare/vite-plugin` (Cloudflare Pages Functions)
- **Styling**: TailwindCSS v4 via `@tailwindcss/vite`
- **Font**: Roboto Variable (`@fontsource-variable/roboto`)
- **Testing**: Vitest + jsdom + `@vue/test-utils`