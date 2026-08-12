import { env } from "../env";
import { app } from "./app";

app.listen(env.PORT, ({ hostname, port }) => {
  const base = `http://${hostname}:${port}`;
  const request = new Request(`${base}/up`);
  const { logger } = app.store;
  logger.info(request, `API running at ${base}`);
  logger.info(request, `Auth OpenAPI: ${base}/api/auth/reference`);
  logger.info(request, `App OpenAPI: ${base}/openapi`);
});
