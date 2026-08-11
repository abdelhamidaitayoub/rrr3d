import { keys as db } from "@repo/db/keys";
import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  extends: [db()],
  runtimeEnv: {
    PORT: process.env.PORT,
    WEB_URL: process.env.WEB_URL,
  },
  server: {
    PORT: z.coerce
      .number()
      .default(3001)
      .describe("The port to run the API on"),
    WEB_URL: z
      .url()
      .default("http://localhost:3000")
      .describe("The URL of the web app"),
  },
  skipValidation: process.env.SKIP_ENV_VALIDATION === "true",
});
