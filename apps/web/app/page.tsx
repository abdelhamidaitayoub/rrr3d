import { Button } from "@repo/ui/components/cn/button";
import { orpc } from "@/lib/rpc/orpc";

export default async function Page() {
  const echo = await orpc.getEcho.call();

  return (
    <div className="flex min-h-svh p-6">
      <div className="flex min-w-0 max-w-md flex-col gap-4 text-sm leading-loose">
        <div>
          <h1 className="font-medium">Project ready!</h1>
          <p>You may now add components and start building.</p>
          <p>We&apos;ve already added the button component for you.</p>
          <p className="font-mono text-muted-foreground">
            Echo: {echo.message}
          </p>
          <Button className="mt-2">Button</Button>
        </div>
        <div className="font-mono text-muted-foreground text-xs">
          (Press <kbd>d</kbd> to toggle dark mode)
        </div>
      </div>
    </div>
  );
}
