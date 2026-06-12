# @feryardiant/learn-viteplus

Monorepo: Vue 3 web app + TypeScript library, managed by Vite+.

## Quick start

```bash
vp install     # install deps (bun 1.3.14, node >=22.12)
vp run dev     # start website dev server
vp run ready   # check + test + build all workspaces
```

## Operational Mandates

- **Metadata Management**: ALL AI-generated metadata (plans, specs, and design documents) MUST be stored exclusively in the `.agents/` directory (e.g., `.agents/plans/`, `.agents/specs/`). Do not use any other directory for persistent or temporary agent artifacts.

## Package map

| workspace                | path              | build                             | test env |
| ------------------------ | ----------------- | --------------------------------- | -------- |
| `@feryardiant/lvp-web`   | `apps/website/`   | `vp build` → `apps/website/dist/` | jsdom    |
| `@feryardiant/lvp-utils` | `packages/utils/` | `vp pack` (tsdown) → `dist/`      | node     |

- Any new app (located in `apps/`) or package (located in `packages/`) should named with `@feryardiant/lvp-` prefix

## Commands

- `vp check` — lint + typecheck (Oxlint + Oxfmt — no ESLint/Prettier)
- `vp check --fix` — auto-fix lint/format issues
- `vp test` — run tests in current workspace
- `vp run <script>` — run script from `package.json`, add `-r` flag to run across all workspaces
  - `vp run -r test` — run tests across all workspaces
  - `vp run -r build` — build all workspaces
- `vp pack` — build the utils library (tsdown-based bundler)
- `vp config` — set up git hooks (runs automatically on `bun prepare`)
- `vp env doctor` — debug setup/runtime issues
- `vp staged` — pre-commit hook: runs `vp check --fix` on staged files
- `vp help` — print a list of commands
- `vp <command> --help` — for information about a specific command

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
- Use conventional commit format: `type: short description` (e.g., `ci:`, `feat:`, `fix:`)
- Keep the subject line concise. Add a brief, informative body when there are multiple changes worth noting.
- Commits should be atomic — one logical change per commit.

## CI/CD

GitHub Actions chain: **Code** (lint on `vp check` via `pull_request_target`) → **Distribute** (build + deploy via `workflow_call`). PRs must pass `vp check` before deploy. **Cleanup** runs on PR close and weekly schedule to prune stale/orphan deployments.

## IDE

- VS Code extensions: `Vue.volar`, `vitest.explorer`, `oxc.oxc-vscode`
- Both VS Code and Zed configured for Oxlint auto-fix-on-save and Oxfmt as default formatter
- npm script runner in VS Code set to `vp`