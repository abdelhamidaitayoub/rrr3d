import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
  input: {
    path: "http://localhost:3001/openapi/json",
    watch: true,
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
