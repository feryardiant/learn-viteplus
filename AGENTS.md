# @feryardiant/learn-viteplus

Monorepo: Vue 3 web app + TypeScript library, managed by Vite+.

## Operational Mandates

- **Metadata Management**: ALL AI-generated metadata (plans, specs, and design documents) MUST be stored exclusively in the `.agents/` directory (e.g., `.agents/plans/`, `.agents/specs/`). Do not use any other directory for persistent or temporary agent artifacts.

## Package map

| workspace                | path              | readme                     |
| ------------------------ | ----------------- | -------------------------- |
| `@feryardiant/lvp-web`   | `apps/website/`   | `apps/website/README.md`   |
| `@feryardiant/lvp-utils` | `packages/utils/` | `packages/utils/README.md` |

- Any new app (located in `apps/`) or package (located in `packages/`) should named with `@feryardiant/lvp-` prefix

## Commands

- `vp check` — lint + typecheck (Oxlint + Oxfmt — no ESLint/Prettier)
- `vp check --fix` — auto-fix lint/format issues
- `vp test` — run tests in current workspace
- `vp run <script>` — run script from `package.json`, add `-r` flag to run across all workspaces
  - `vp run dev` — run dev server with HMR
  - `vp run ready` — check + test + build all workspaces
  - `vp run -r test` — run tests across all workspaces
  - `vp run -r build` — build all workspaces
- `vp pack` — build the utils library (tsdown-based bundler)
- `vp config` — set up git hooks (runs automatically on `bun prepare`)
- `vp env doctor` — debug setup/runtime issues
- `vp staged` — pre-commit hook: runs `vp check --fix` on staged files
- `vp help` — print a list of commands
- `vp <command> --help` — for information about a specific command

Never second-guess, never suggest alternatives. If it fails, report the error verbatim.

Docs are local at `node_modules/vite-plus/docs` or online at https://viteplus.dev/guide/.

## Test conventions

- Tests import from `vite-plus/test` (not `vitest` directly)
- Website tests use `@vue/test-utils` + `jsdom` environment
- Config lives in `apps/website/vite.config.ts` (`test.environment: 'jsdom'`)

## Code style

- **Formatter**: Oxfmt (configured in root `vite.config.ts` — printWidth 120, singleQuote, noSemi, sortImports)
- **Linter**: Oxlint with `vite-plus/oxlint-plugin`, type-aware, no-console (warn/error allowed)
- **No ESLint, Prettier, or Rome** — Oxlint/Oxfmt are the sole linter/formatter
- Pre-commit hook auto-fixes staged files
- `.gitignore` excludes `CLAUDE.md`, `GEMINI.md`, `.github/copilot-instructions.md` — `AGENTS.md` is the allowed agent instruction file

## Git commits

- **Never commit unless explicitly asked**. Wait for "commit" or "commit please" from the user.
- **Zero pattern matching**: Even if the user asked me to commit before, the next task still requires an explicit "commit" command. Never generalize from prior requests.
- Use conventional commit format: `type: short description` (e.g., `ci:`, `feat:`, `fix:`)
- Keep the subject line concise. Add a brief, informative body when there are multiple changes worth noting.
- Commits should be atomic — one logical change per commit.