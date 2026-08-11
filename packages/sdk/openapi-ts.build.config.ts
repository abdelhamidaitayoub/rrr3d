import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
  input: {
    path: "../../apps/api/openapi.json",
  },
  output: {
    path: "./src/generated",
  },
  plugins: [
    "zod",
    {
      name: "@hey-api/sdk",
      validator: true,
    },
  ],
});
