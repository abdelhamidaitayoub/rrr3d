import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
  input: {
    path: "../../apps/api/openapi.json",
  },
  output: {
    path: "./src/generated",
    tsConfigPath: "./tsconfig.json",
  },
  plugins: [
    "zod",
    {
      name: "orpc",
      validator: true,
    },
  ],
});
