import { auth } from "./auth";

let schemaPromise:
  | ReturnType<typeof auth.api.generateOpenAPISchema>
  | undefined;

const getSchema = () => {
  schemaPromise ??= auth.api.generateOpenAPISchema();
  return schemaPromise;
};

export const OpenAPI = {
  components: getSchema().then(({ components }) => components) as Promise<
    Record<string, unknown>
  >,
  getPaths: (prefix = "/auth/api") =>
    getSchema().then(({ paths }) => {
      const reference: typeof paths = Object.create(null);

      for (const path of Object.keys(paths)) {
        const pathItem = paths[path];
        if (!pathItem) {
          continue;
        }

        const key = prefix + path;
        reference[key] = pathItem;

        for (const method of Object.keys(pathItem)) {
          const operation = (
            reference[key] as Record<string, { tags?: string[] }>
          )[method];
          if (operation) {
            operation.tags = ["Better Auth"];
          }
        }
      }

      return reference;
    }) as Promise<Record<string, unknown>>,
} as const;
