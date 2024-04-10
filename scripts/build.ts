import { $ } from "bun";

await $`echo "Formatting code"`;

await $`bunx @biomejs/biome format --write ./src`;

await $`echo "Linting code"`;

await $`bunx @biomejs/biome lint --apply ./src`;

await $`echo "Import sorting the code"`;

await $`bunx @biomejs/biome check --apply ./src`;

await $`echo "Type-checking code"`;

await $`bunx tsc`;

await $`echo "Running tests"`;

await $`bun test`;

await $`echo "Building project"`;

await $`bunx vite build`;

await $`echo "Project built successfully"`;
