import { env } from "@/env";

const RPC_PREFIX_RE = /^\/rpc/;

async function proxy(request: Request) {
  const url = new URL(request.url);
  const targetPath = url.pathname.replace(RPC_PREFIX_RE, "");
  const targetUrl = new URL(targetPath + url.search, env.API_URL);

  const headers = new Headers(request.headers);
  headers.delete("host");

  const response = await fetch(targetUrl, {
    body: request.body,
    // @ts-expect-error required for streaming request bodies in Node
    duplex: "half",
    headers,
    method: request.method,
  });

  return new Response(response.body, {
    headers: response.headers,
    status: response.status,
    statusText: response.statusText,
  });
}

export const HEAD = proxy;
export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
