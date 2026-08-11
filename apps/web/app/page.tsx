import { Suspense } from "react";
import "@/lib/rpc/orpc.server";
import { Badge } from "@repo/ui/components/cn/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/cn/card";
import { Skeleton } from "@repo/ui/components/cn/skeleton";
import { EchoClient } from "@/components/echo-client";
import { EchoHydrated } from "@/components/echo-hydrated";
import { EchoResult } from "@/components/echo-result";
import { getQueryClient, HydrateClient } from "@/lib/query/hydration";
import { orpc } from "@/lib/rpc/orpc";

function CodeSnippet({ children }: { children: string }) {
  return (
    <pre className="overflow-x-auto font-mono text-[11px] text-muted-foreground leading-relaxed">
      {children}
    </pre>
  );
}

export default async function Page() {
  const echo = await orpc.getEcho.call();

  const queryClient = getQueryClient();
  queryClient.prefetchQuery(orpc.getEcho.queryOptions());

  return (
    <main className="mx-auto flex min-h-svh w-full max-w-2xl flex-col gap-8 p-6">
      <header className="flex flex-col gap-2">
        <h1 className="font-medium text-lg tracking-tight">
          oRPC consumption patterns
        </h1>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Three ways to call <code className="font-mono">getEcho</code> from the
          web app — pick the one that fits where the data is needed.
        </p>
      </header>

      <div className="flex flex-col gap-4">
        <Card>
          <CardHeader>
            <CardAction>
              <Badge variant="secondary">Server Component</Badge>
            </CardAction>
            <CardTitle>1. Direct server call</CardTitle>
            <CardDescription>
              Call the API directly inside an async Server Component. The
              request runs on the server during render — no client JavaScript,
              no loading state.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <EchoResult message={echo.message} />
          </CardContent>
          <CardFooter className="flex-col items-start gap-1 border-t bg-muted/20">
            <CodeSnippet>
              {"const echo = await orpc.getEcho.call();"}
            </CodeSnippet>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardAction>
              <Badge variant="secondary">SSR + Hydration</Badge>
            </CardAction>
            <CardTitle>2. Prefetched query</CardTitle>
            <CardDescription>
              Prefetch on the server with TanStack Query, then hydrate on the
              client. The child component reads from cache instantly — no
              loading flash on first paint.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <HydrateClient client={queryClient}>
              <Suspense
                fallback={<Skeleton className="h-10 w-full rounded-none" />}
              >
                <EchoHydrated />
              </Suspense>
            </HydrateClient>
          </CardContent>
          <CardFooter className="flex-col items-start gap-1 border-t bg-muted/20">
            <CodeSnippet>{`queryClient.prefetchQuery(orpc.getEcho.queryOptions());

<HydrateClient client={queryClient}>
  <EchoHydrated />
</HydrateClient>`}</CodeSnippet>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardAction>
              <Badge variant="secondary">Client Component</Badge>
            </CardAction>
            <CardTitle>3. Client-side query</CardTitle>
            <CardDescription>
              Fetch entirely in the browser with{" "}
              <code className="font-mono">useQuery</code>. Use this for
              interactive UI that loads or refetches data after the page mounts.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <EchoClient />
          </CardContent>
          <CardFooter className="flex-col items-start gap-1 border-t bg-muted/20">
            <CodeSnippet>
              {"const { data } = useQuery(orpc.getEcho.queryOptions());"}
            </CodeSnippet>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
