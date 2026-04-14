# mfrh-xyz

@AGENTS.md

**Stack:** Next.js 16 (App Router), Payload CMS 3.x, PostgreSQL, React 19, Tailwind CSS 4, TypeScript
**DB:** `@payloadcms/db-postgres` — connection via `DATABASE_URI` env var
## Deploy
- Docker + Coolify on cv.mfrh.xyz
- Push to `main` triggers auto-deploy via Coolify webhook
- Entrypoint runs `npx payload migrate` before starting Next.js
- Coolify API available via MCP for deployment status, logs, and config
- App UUID: `rbr4pcoj9cwiupyu08n1su5r`

## Structure
- `src/payload.config.ts` — single-file CMS config (collections: pages, projects, cover-letters, media, users; globals: site-settings, cv)
- `src/app/(frontend)/` — public pages, `src/app/(payload)/` — admin panel
- `src/app/api/` — API routes (draft preview, AI generation, media proxy)
- `src/components/` — `blocks/`, `site/`, `cv/`, `cover-letter/`, `admin/`
- `src/migrations/` — Payload DB migrations
- `content/` — static content (cover-letter, cv templates)

## Key Commands
- `npm run dev` — dev server (port 3000)
- `npm run build` — production build
- `npm run payload migrate:create` — create migration
- `npm run payload migrate` — run migrations

## Conventions
- Payload `push: true` in dev (auto-syncs schema), migrations required for prod
- AI text generation via OpenRouter (configured in site-settings global)
- Cover letters use token-based sharing (random URL tokens, optional expiry)
- Slugs auto-generated from titles via custom `slugify` (handles German umlauts)

## Docs
- `docs/references/` — project reference docs
