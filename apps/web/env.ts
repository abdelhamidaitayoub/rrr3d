import { keys as db } from "@repo/db/keys";
import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  client: {
    NEXT_PUBLIC_API_URL: z.url(),
  },
  clientPrefix: "NEXT_PUBLIC_",
  extends: [db()],
  runtimeEnv: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  server: {},
  skipValidation: process.env.SKIP_ENV_VALIDATION === "true",
});
