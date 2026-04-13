# mfrh-cv

Personal portfolio and CV site built with Next.js 16, Payload CMS 3.x, and PostgreSQL.

Live at [cv.mfrh.xyz](https://cv.mfrh.xyz)

## Prerequisites

- Node.js 22+
- [Colima](https://github.com/abiosoft/colima) (or any Docker runtime)

## Local Development

```bash
npm install
npm run dev
```

This single command:
1. Starts Colima (Docker runtime) if not already running
2. Starts PostgreSQL via `docker-compose.dev.yml` (port 5433)
3. Starts Next.js dev server on [localhost:3000](http://localhost:3000)

On first run with an empty database, the seed script automatically creates:
- Admin user (`admin@mfrh.xyz`)
- Homepage with hero block
- CV data and sample cover letter (from `content/`)

### Reset Database

To start fresh, remove the Docker volume and restart:

```bash
docker compose -f docker-compose.dev.yml down -v
npm run dev
```

## Production

Deployed via Docker + Coolify. Migrations are required for schema changes:

```bash
npm run payload migrate:create
npm run payload migrate
```
