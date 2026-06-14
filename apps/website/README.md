# web

Vue 3 website with SSR via Cloudflare Pages Functions, styled with TailwindCSS v4.

## Tech stack

- **Framework**: Vue 3 with Composition API + `<script setup>`
- **Routing**: vue-router 5 (HashHistory in dev, WebHistory in prod)
- **State**: Pinia (counter example)
- **Rendering**: SSR via `@cloudflare/vite-plugin` (Cloudflare Pages Functions)
- **Styling**: TailwindCSS v4 via `@tailwindcss/vite`
- **Font**: Roboto Variable (`@fontsource-variable/roboto`)
- **Testing**: Vitest + jsdom + `@vue/test-utils`

## CSS architecture

### Global styles (`src/style.css`)

- `@import 'tailwindcss'` — Tailwind base/components/utilities
- `@theme` — Custom design tokens following TailwindCSS v4 naming conventions:
  - `--font-sans`, `--font-mono`, `--font-heading`
  - `--color-bg`, `--color-border`, `--color-text-muted`, `--color-text-heading`
  - `--color-accent`, `--color-accent-bg`, `--color-accent-border`
  - `--color-code-bg`, `--color-social-bg`, `--shadow-custom`
- `@layer base` — Base element resets (`:root`, headings, paragraphs, `code`)
- `#app` — Application shell layout (centered, bordered, full-height flex column)
- `#center` — Shared route layout (centered flex column with gap)
- `@variant dark` — Dark mode variable overrides

### Component styles (`.vue` scoped blocks)

Each component owns its styling via `<style scoped>`:

| Component  | Scoped styles                                                   |
| ---------- | --------------------------------------------------------------- |
| `App.vue`  | `nav`, nav links, `router-link-exact-active`, `#spacer`         |
| `Home.vue` | `.hero`, `#counter`, `.counter` buttons, `#next-steps`, `#docs` |
| `Tick.vue` | Tick mark borders (unscoped, shared across routes)              |

### Variable migration

The project migrated from standalone CSS custom properties to TailwindCSS v4 `@theme` tokens:

| Legacy      | TailwindCSS v4         |
| ----------- | ---------------------- |
| `--text`    | `--color-text-muted`   |
| `--text-h`  | `--color-text-heading` |
| `--bg`      | `--color-bg`           |
| `--border`  | `--color-border`       |
| `--code-bg` | `--color-code-bg`      |
| `--accent`  | `--color-accent`       |
| `--shadow`  | `--shadow-custom`      |
| `--sans`    | `--font-sans`          |
| `--mono`    | `--font-mono`          |