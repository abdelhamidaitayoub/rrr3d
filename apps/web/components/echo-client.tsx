"use client";

import { useQuery } from "@tanstack/react-query";
import { EchoResult } from "@/components/echo-result";
import { orpc } from "@/lib/rpc/orpc";

export function EchoClient() {
  const { data, isPending, error } = useQuery(orpc.getEcho.queryOptions());

  if (error) {
    return (
      <p className="text-destructive text-xs">
        Failed to fetch: {error.message}
      </p>
    );
  }

  return <EchoResult loading={isPending} message={data?.message} />;
}
