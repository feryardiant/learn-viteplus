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

## Project structure

```
src/
├── app.ts                 # SSR app factory: createApp() + createRouter()
├── App.vue                # Root: <router-view>, <nav>, <Tick>
├── main.ts                # Client entry
├── server.ts              # SSR entry: render(url) → html
├── style.css              # Tailwind imports + @theme + @variant dark
├── assets/                # Static images (hero.png, svgs)
├── components/            # Card.vue, ExternalLink.vue, Tick.vue
├── routes/                # index.ts (route defs), Home.vue, Other.vue
└── stores/                # counter.ts (Pinia store)
```

No `composables/`, `layouts/`, `plugins/`, `middleware/` yet.

## Environment variables

- No `.env` files or custom `VITE_*`/`PUBLIC_*` vars currently
- `import.meta.env.BASE_URL` used in `main.ts`
- `process.env.VITEST` used in vite config to disable Cloudflare plugin during tests