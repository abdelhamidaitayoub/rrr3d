# oRPC Consumption in the Web App

The web app calls the API through a typed oRPC client generated from `@repo/sdk`. The contract is the source of truth for available procedures — for example, `getEcho` maps to `GET /echo`.

This doc covers the three supported consumption patterns and the files involved in each.

## Architecture

```text
API (Elysia)  →  OpenAPI schema  →  @repo/sdk contract
                                         ↓
                              apps/web/lib/rpc/orpc.ts
                                         ↓
                    Server Component / Client Component / TanStack Query
```

On the **server**, requests go directly to `API_URL` (see `apps/web/.env.local`).

On the **client**, requests go through the Next.js proxy at `/rpc`, which forwards to the same API.

| File | Role |
| --- | --- |
| `apps/web/lib/rpc/orpc.server.ts` | Server-only client. Sets `globalThis.$client` using `env.API_URL`. |
| `apps/web/lib/rpc/orpc.ts` | Shared client + TanStack Query utils (`orpc`). Uses `$client` on the server, `/rpc` proxy in the browser. |
| `apps/web/lib/query/client.ts` | `QueryClient` with oRPC-aware serialize/deserialize for SSR hydration. |
| `apps/web/lib/query/hydration.tsx` | `getQueryClient()` and `HydrateClient` for prefetch + dehydrate. |
| `apps/web/app/rpc/[[...rest]]/route.ts` | Proxy route: `/rpc/*` → `API_URL/*`. |

Import `orpc.server` in Server Components (or in `layout.tsx` / `instrumentation.ts`) so the server client is available before any procedure is called:

```ts
import "@/lib/rpc/orpc.server";
```

## Pattern 1: Direct Server Call

Use when data is only needed during server render — no client JavaScript, no loading state.

```tsx
import "@/lib/rpc/orpc.server";
import { orpc } from "@/lib/rpc/orpc";

export default async function Page() {
  const echo = await orpc.getEcho.call();

  return <p>{echo.message}</p>;
}
```

**When to use:** static content, metadata, one-off server-side data fetching.

**Live example:** `apps/web/app/page.tsx` (first card)

## Pattern 2: Prefetched Query (SSR + Hydration)

Use when a Client Component needs data on first paint without a loading flash. Prefetch on the server, dehydrate the cache, then read it with `useQuery` or `useSuspenseQuery` on the client.

**Server Component (page):**

```tsx
import "@/lib/rpc/orpc.server";
import { Suspense } from "react";
import { orpc } from "@/lib/rpc/orpc";
import { getQueryClient, HydrateClient } from "@/lib/query/hydration";
import { EchoHydrated } from "@/components/echo-hydrated";

export default function Page() {
  const queryClient = getQueryClient();

  queryClient.prefetchQuery(orpc.getEcho.queryOptions());

  return (
    <HydrateClient client={queryClient}>
      <Suspense fallback={<p>Loading…</p>}>
        <EchoHydrated />
      </Suspense>
    </HydrateClient>
  );
}
```

**Client Component:**

```tsx
"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { orpc } from "@/lib/rpc/orpc";

export function EchoHydrated() {
  const { data } = useSuspenseQuery(orpc.getEcho.queryOptions());

  return <p>{data.message}</p>;
}
```

**When to use:** pages where client components need API data immediately, with caching and refetch handled by TanStack Query.

**Live example:** `apps/web/app/page.tsx` (second card), `apps/web/components/echo-hydrated.tsx`

> `useSuspenseQuery` requires a `<Suspense>` boundary. With prefetch + dehydrate, the query resolves from cache on first paint.

## Pattern 3: Client-Side Query

Use when data is fetched entirely in the browser — after mount, on user interaction, or when refetching.

```tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import { orpc } from "@/lib/rpc/orpc";

export function EchoClient() {
  const { data, isPending, error } = useQuery(orpc.getEcho.queryOptions());

  if (isPending) return <p>Loading…</p>;
  if (error) return <p>Error: {error.message}</p>;

  return <p>{data.message}</p>;
}
```

**When to use:** interactive UI, polling, refetch-on-focus, data that depends on client-only state.

**Live example:** `apps/web/app/page.tsx` (third card), `apps/web/components/echo-client.tsx`

## Choosing a Pattern

| Pattern | Runs on | Loading state | TanStack Query cache |
| --- | --- | --- | --- |
| Direct server call | Server only | None | No |
| Prefetched query | Server + client | None (if prefetched) | Yes |
| Client query | Client only | Yes | Yes |

## Procedures With Input

Some procedures take input. For example, `getIndex` accepts a query parameter:

```ts
await orpc.getIndex.call({ query: { command: "Hello" } });

orpc.getIndex.queryOptions({ input: { query: { command: "Hello" } } });
```

The shape comes from the generated contract in `@repo/sdk`. After changing the API, regenerate the SDK — see [SDK Generation](./sdk-generation.md).

## Local Development

Run both apps:

```bash
bun run --cwd apps/api dev
bun run --cwd apps/web dev
```

Set `API_URL` in `apps/web/.env.local`:

```text
API_URL=http://localhost:3001
```

Open the web app and visit the home page to see all three patterns in action.

## Related Docs

- [SDK Generation](./sdk-generation.md) — how the `@repo/sdk` contract is generated from the API
