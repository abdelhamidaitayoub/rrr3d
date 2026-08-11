import { keys as db } from "@repo/db/keys";
import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  client: {},
  clientPrefix: "NEXT_PUBLIC_",
  extends: [db()],
  runtimeEnv: {
    API_URL: process.env.API_URL,
  },
  server: {
    API_URL: z.url(),
  },
  skipValidation: process.env.SKIP_ENV_VALIDATION === "true",
});
