import { fromTypes, openapi } from "@elysia/openapi";
import { Elysia } from "elysia";
import logixlysia from "logixlysia";
import { z } from "zod";

export const app = new Elysia()

  .use(
    openapi({
      embedSpec: true,
      references: fromTypes(),
    })
  )
  .use(logixlysia())
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
