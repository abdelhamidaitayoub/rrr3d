import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
  input: {
    path: "http://localhost:3001/openapi/json",
    watch: true,
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
