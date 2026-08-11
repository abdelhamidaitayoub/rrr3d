import { writeFile } from "node:fs/promises";
import { app } from "../src/app";

const specResponse = await app.handle(
  new Request("http://localhost/openapi/json")
);

if (!specResponse.ok) {
  throw new Error(`Failed to export OpenAPI spec: ${specResponse.status}`);
}

const spec = await specResponse.json();
const outputPath = new URL("../openapi.json", import.meta.url);

await writeFile(outputPath, `${JSON.stringify(spec, null, 2)}\n`);
