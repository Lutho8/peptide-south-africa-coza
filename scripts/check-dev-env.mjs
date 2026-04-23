#!/usr/bin/env node
/**
 * Preflight sanity check for the Vite dev server.
 *
 * Verifies that the critical dependencies needed to boot Vite are physically
 * present on disk. The most common failure mode in this sandbox is a corrupted
 * Bun isolated install where `vite` exists but its nested `esbuild` is missing,
 * which causes Vite to exit with code 1 and a cryptic ERR_MODULE_NOT_FOUND.
 *
 * Usage:
 *   node scripts/check-dev-env.mjs
 *
 * Exit codes:
 *   0 - environment OK
 *   1 - one or more critical packages missing (actionable message printed)
 */
import { existsSync } from "node:fs";
import { createRequire } from "node:module";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const checks = [
  {
    name: "vite",
    test: () => require.resolve("vite/package.json", { paths: [root] }),
  },
  {
    name: "esbuild",
    test: () => require.resolve("esbuild/package.json", { paths: [root] }),
  },
  {
    name: "@vitejs/plugin-react-swc",
    test: () =>
      require.resolve("@vitejs/plugin-react-swc/package.json", {
        paths: [root],
      }),
  },
];

const failures = [];
for (const c of checks) {
  try {
    const p = c.test();
    if (!existsSync(p)) throw new Error(`resolved but missing: ${p}`);
    console.log(`  ✓ ${c.name}`);
  } catch (err) {
    failures.push({ name: c.name, message: err?.message ?? String(err) });
    console.log(`  ✗ ${c.name}`);
  }
}

if (failures.length > 0) {
  console.error("\n────────────────────────────────────────────────────────");
  console.error(" Dev environment check FAILED");
  console.error("────────────────────────────────────────────────────────");
  for (const f of failures) {
    console.error(` • ${f.name}: ${f.message}`);
  }
  console.error("\n Likely cause: corrupted node_modules (Bun isolated cache).");
  console.error(" Recovery:");
  console.error("   rm -rf node_modules bun.lockb && bun install");
  console.error("────────────────────────────────────────────────────────\n");
  process.exit(1);
}

console.log("\n✓ Dev environment OK — Vite is ready to boot.");
process.exit(0);
