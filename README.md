# rrr3d

A Turborepo monorepo template with Next.js, Elysia, Prisma, better-auth, and shadcn/ui.

## Create a new project

```bash
npx rrr3d@latest init
```

Or pass a project name directly:

```bash
npx rrr3d@latest init my-app
```

### Options

| Flag | Description |
| --- | --- |
| `--name <name>` | Project directory name |
| `--package-manager <manager>` | `bun`, `npm`, `yarn`, or `pnpm` |
| `--disable-git` | Skip git initialization |
| `--skip-docker` | Skip starting the local Postgres container |
| `--branch <branch>` | Clone a specific Git branch |

## Local development

After cloning this repository:

```bash
bun install
bun run build:cli
node dist/index.js init --name test-app --disable-git --skip-docker
```

## Manual setup (without the CLI)

1. Copy env files from `.env.example` in each app/package
2. Start Postgres: `docker compose up -d`
3. Install dependencies: `bun install`
4. Run migrations: `bun run migrate:deploy`
5. Generate the SDK: `bunx turbo run generate --filter=@repo/sdk`
6. Start dev servers: `bun run dev`

Web runs on http://localhost:3000 and the API on http://localhost:3001.

## Adding components

To add shadcn/ui components:

```bash
bunx shadcn@latest add button -c apps/web
```

Components are placed in `packages/ui/src/components`.

```tsx
import { Button } from "@repo/ui/components/button";
```
