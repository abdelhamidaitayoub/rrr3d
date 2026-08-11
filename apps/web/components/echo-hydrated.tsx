"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { EchoResult } from "@/components/echo-result";
import { orpc } from "@/lib/rpc/orpc";

export function EchoHydrated() {
  const { data } = useSuspenseQuery(orpc.getEcho.queryOptions());

  return <EchoResult message={data.message} />;
}
