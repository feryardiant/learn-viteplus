# The Pages

Vue 3 website with SSR via Cloudflare Pages Functions, styled with TailwindCSS v4.

URL: [`https://learn-viteplus.pages.dev/`](https://learn-viteplus.pages.dev/)

## Tech stack

- **Framework**: Vue 3 with Composition API + `<script setup>`
- **Routing**: vue-router 5 (HashHistory in dev, WebHistory in prod)
- **State**: Pinia (counter example)
- **Rendering**: SSR via `@cloudflare/vite-plugin` (Cloudflare Pages)
- **Styling**: TailwindCSS v4 via `@tailwindcss/vite`
- **Font**: Roboto Variable (`@fontsource-variable/roboto`)
- **Testing**: Vitest + jsdom + `@vue/test-utils`

## Project structure

```text
src/
├── assets/       # Static images (hero.png, svgs)
├── components/   # card.vue, external-link.vue, tick.vue
├── routes/       # index.ts (route defs), home.vue, other.vue
├── stores/       # counter.ts (Pinia store)
├── app.ts        # SSR app factory: createApp() + createRouter()
├── app.vue       # Root: <router-view>, <nav>, <Tick>
├── main.ts       # Client entry
├── ssr.ts        # SSR entry: render(url) → html
└── style.css     # Tailwind imports + @theme + @variant dark
```

No `composables/`, `layouts/`, `plugins/`, `middleware/` yet.