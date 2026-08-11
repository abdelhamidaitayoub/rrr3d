import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const keys = () =>
  createEnv({
    runtimeEnv: {
      DATABASE_URL: process.env.DATABASE_URL,
    },
    server: {
      DATABASE_URL: z.url(),
    },
    skipValidation: process.env.SKIP_ENV_VALIDATION === "true",
  });
