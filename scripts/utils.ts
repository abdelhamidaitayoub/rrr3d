import { type SpawnSyncOptions, spawnSync } from "node:child_process";
import { join } from "node:path";

export const url = "https://github.com/abdelhamidaitayoub/turbox";

export const shellOption = process.platform === "win32";

export const run = (
  command: string,
  args: string[],
  options?: SpawnSyncOptions
) => {
  const result = spawnSync(command, args, {
    shell: shellOption,
    stdio: "inherit",
    ...options,
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    const stderr = result.stderr?.toString().trim();
    const message = stderr
      ? `Command failed: ${command} ${args.join(" ")}\n${stderr}`
      : `Command failed with exit code ${result.status}: ${command} ${args.join(" ")}`;
    throw new Error(message);
  }

  return result;
};

export const internalContentDirs = [join(".github", "workflows")];

export const internalContentFiles = [".autorc", "CHANGELOG.md"];
