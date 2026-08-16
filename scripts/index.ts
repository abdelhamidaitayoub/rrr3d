#!/usr/bin/env node

import { program } from "commander";
import { initialize } from "./initialize.js";

program
  .command("init")
  .description("Initialize a new rrr3d project")
  .option("--name <name>", "Name of the project")
  .option(
    "--package-manager <manager>",
    "Package manager to use (bun, npm, yarn, pnpm)"
  )
  .option("--disable-git", "Disable git initialization")
  .option("--skip-docker", "Skip starting the local Postgres container")
  .option("--branch <branch>", "Git branch to clone from")
  .action(initialize);

program.parse(process.argv);
