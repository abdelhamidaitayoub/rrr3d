import cors from "@elysia/cors";
import { fromTypes, openapi } from "@elysia/openapi";
import { auth } from "@repo/auth";
import { Elysia } from "elysia";
import logixlysia from "logixlysia";
import { z } from "zod";
import { env } from "../env";

export const app = new Elysia()
  .use(
    cors({
      origin: env.ALLOWED_ORIGINS,
    })
  )
  .use(
    openapi({
      references: fromTypes(),
    })
  )
  .mount(auth.handler)
  .use(
    logixlysia({
      config: {
        showStartupMessage: false,
      },
    })
  )
  .get("/", ({ query: { command } }) => ({ command }), {
    query: z.object({
      command: z.string(),
    }),
    response: z.object({
      command: z.string(),
    }),
  })
  .get("/echo", () => ({ message: "hello" }), {
    response: z.object({
      message: z.string(),
    }),
  });

export type App = typeof app;
