import { fromTypes, openapi } from "@elysia/openapi";
import { Elysia } from "elysia";
import { z } from "zod";

export const app = new Elysia()
  .use(
    openapi({
      embedSpec: true,
      references: fromTypes(),
    })
  )
  .get("/", () => ({ hello: "hello" }), {
    response: z.object({
      hello: z.string(),
    }),
  })
  .post("/echo", ({ body }) => body, {
    body: z.object({
      message: z.string(),
    }),
    response: z.object({
      message: z.string(),
    }),
  });

export type App = typeof app;
