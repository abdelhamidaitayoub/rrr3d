import { createORPCClient } from "@orpc/client";
import type { ContractRouterClient } from "@orpc/contract";
import type { JsonifiedClient } from "@orpc/openapi-client";
import { OpenAPILink } from "@orpc/openapi-client/fetch";
import { createTanstackQueryUtils } from "@orpc/tanstack-query";
import { contract } from "@repo/sdk";

declare global {
  var $client:
    | JsonifiedClient<ContractRouterClient<typeof contract>>
    | undefined;
}

const link = new OpenAPILink(contract, {
  url: () => {
    if (typeof window === "undefined") {
      throw new Error("OpenAPILink is not allowed on the server side.");
    }

    return `${window.location.origin}/rpc`;
  },
});

/**
 * Fallback to client-side client if server-side client is not available.
 */
export const client: JsonifiedClient<ContractRouterClient<typeof contract>> =
  globalThis.$client ?? createORPCClient(link);

/**
 * Create Tanstack Query utils for the ORPC client.
 */
export const orpc = createTanstackQueryUtils(client);
