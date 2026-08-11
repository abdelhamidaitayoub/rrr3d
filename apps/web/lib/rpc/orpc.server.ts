import "server-only";

import { createORPCClient } from "@orpc/client";
import type { ContractRouterClient } from "@orpc/contract";
import type { JsonifiedClient } from "@orpc/openapi-client";
import { OpenAPILink } from "@orpc/openapi-client/fetch";
import { contract } from "@repo/sdk";
import { headers } from "next/headers";
import { env } from "@/env";

export type OrpcClient = JsonifiedClient<ContractRouterClient<typeof contract>>;

const link = new OpenAPILink(contract, {
  headers: () => headers(),
  url: env.API_URL,
});

globalThis.$client = createORPCClient<OrpcClient>(link);
