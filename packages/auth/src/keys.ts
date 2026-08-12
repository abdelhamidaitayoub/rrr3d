import { keys as db } from "@repo/db/keys";
import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";
export const keys = () =>
  createEnv({
    extends: [db()],
    runtimeEnv: {
      BETTER_AUTH_BASE_URL: process.env.BETTER_AUTH_BASE_URL,
      BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    },
    server: {
      BETTER_AUTH_BASE_URL: z.url(),
      BETTER_AUTH_SECRET: z.string(),
    },
    skipValidation: process.env.SKIP_ENV_VALIDATION === "true",
  });
