# SDK Generation

This repo generates the `@repo/sdk` package from the API OpenAPI schema.

The important rule is:

> Dev can use the running local API URL, but build/CI must generate from local files.

That keeps local development fast while making production builds private, repeatable, and independent from a live API server.

## Why This Setup Exists

The SDK is generated from the API contract. In development, it is convenient to watch the running API:

```bash
bun run --cwd packages/sdk dev
```

That command uses:

```text
http://localhost:3001/openapi/json
```

This is fine for local development because the API is already running on your machine.

For build and CI, we do not want to fetch the OpenAPI schema from staging or production. That would make builds depend on a live service, and it could require exposing API documentation publicly.

Instead, the build path exports the OpenAPI schema locally from the API app without opening a server port.

## Dev Flow

Run the API:

```bash
bun run --cwd apps/api dev
```

Run the SDK generator in watch mode:

```bash
bun run --cwd packages/sdk dev
```

The dev SDK config is:

```text
packages/sdk/openapi-ts.config.ts
```

It points at the local API URL and keeps watching for schema changes.

## Build Flow

Build does not need the API server to be live.

The API app is exported from:

```text
apps/api/src/app.ts
```

The server entrypoint is:

```text
apps/api/src/index.ts
```

This split matters because `app.ts` can be imported by build scripts without calling `.listen()`.

The build-time OpenAPI export script is:

```text
apps/api/scripts/export-openapi.ts
```

It calls the OpenAPI route in memory:

```text
app.handle(new Request("http://localhost/openapi/json"))
```

Then it writes:

```text
apps/api/openapi.json
```

That file is ignored by Git because it is a generated build artifact.

## SDK Build Config

The build SDK config is:

```text
packages/sdk/openapi-ts.build.config.ts
```

It reads from the locally exported schema:

```text
../../apps/api/openapi.json
```

So the build path is:

```text
API source code -> apps/api/openapi.json -> packages/sdk/src/generated
```

No production API URL is needed.

## Turbo Tasks

The important Turbo tasks are:

```text
api#openapi:export
@repo/sdk#generate
@repo/sdk#build
@repo/sdk#typecheck
```

The SDK package has its own `turbo.json` so its special dependency on the API schema stays close to the SDK package.

When the SDK generates or typechecks, Turbo runs:

```text
api#openapi:export -> @repo/sdk#generate
```

This means a fresh clone can regenerate the SDK before checking types.

## Generated Files and Git

Do not commit:

```text
packages/sdk/src/generated/
```

Those files are generated from the OpenAPI schema and are ignored by:

```text
packages/sdk/.gitignore
```

If generated SDK files were tracked before, they must be removed from Git tracking once:

```bash
git rm --cached -r packages/sdk/src/generated
```

This does not delete the local files. It only tells Git to stop tracking them.

After that, normal build/typecheck commands regenerate the SDK when needed.

## Useful Commands

Export the OpenAPI schema:

```bash
bun run --cwd apps/api openapi:export
```

Generate the SDK from the local schema:

```bash
bun run --cwd packages/sdk generate
```

Run SDK generation through Turbo:

```bash
bunx turbo run generate --filter=@repo/sdk
```

Build the SDK through Turbo:

```bash
bunx turbo run build --filter=@repo/sdk
```

Typecheck the SDK through Turbo:

```bash
bunx turbo run typecheck --filter=@repo/sdk
```

## Privacy Model

The API documentation route can exist for local development, but build/CI does not need it to be publicly reachable.

The production-safe rule is:

> Build from source, not from a deployed API.

Because the OpenAPI schema is exported in-process from the API app, the build can run in CI without exposing `/openapi/json` to everyone.

## If the Web App Uses the SDK

If `apps/web` imports `@repo/sdk`, add `@repo/sdk` to `apps/web/package.json`.

That package dependency tells Turbo the web app depends on the SDK package. Without that dependency, Turbo cannot know the correct build order.
