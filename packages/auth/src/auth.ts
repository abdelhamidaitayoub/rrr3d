import prisma from "@repo/db";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { openAPI } from "better-auth/plugins";
import { keys } from "./keys";

export const auth = betterAuth({
  baseURL: keys().BETTER_AUTH_BASE_URL,
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  plugins: [openAPI()],
  secret: keys().BETTER_AUTH_SECRET,
});

export type Auth = typeof auth;
