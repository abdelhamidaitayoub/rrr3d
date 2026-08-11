import { Spinner } from "@repo/ui/components/cn/spinner";
import { cn } from "@repo/ui/lib/utils";

export function EchoResult({
  message,
  loading,
  className,
}: {
  message?: string;
  loading?: boolean;
  className?: string;
}) {
  if (loading) {
    return (
      <div
        className={cn(
          "flex items-center gap-2 border bg-muted/40 px-3 py-2.5 font-mono text-xs",
          className
        )}
      >
        <Spinner />
        <span className="text-muted-foreground">Fetching from API…</span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "border bg-muted/40 px-3 py-2.5 font-mono text-xs",
        className
      )}
    >
      <span className="text-muted-foreground">{"{ message: "}</span>
      <span className="text-foreground">&quot;{message}&quot;</span>
      <span className="text-muted-foreground">{" }"}</span>
    </div>
  );
}
