import {
  type StandardRPCJsonSerializedMetaItem,
  StandardRPCJsonSerializer,
} from "@orpc/client/standard";
import {
  defaultShouldDehydrateQuery,
  QueryClient,
} from "@tanstack/react-query";

const serializer = new StandardRPCJsonSerializer();

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      dehydrate: {
        serializeData(data) {
          const [json, meta] = serializer.serialize(data);
          return { json, meta };
        },
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === "pending",
      },
      hydrate: {
        deserializeData(data: {
          json: unknown;
          meta: readonly StandardRPCJsonSerializedMetaItem[];
        }) {
          return serializer.deserialize(data.json, data.meta);
        },
      },
      queries: {
        queryKeyHashFn(queryKey) {
          const [json, meta] = serializer.serialize(queryKey);
          return JSON.stringify({ json, meta });
        },
        staleTime: 60 * 1000,
      },
    },
  });
}
