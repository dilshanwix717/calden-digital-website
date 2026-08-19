#!/usr/bin/env node
/**
 * Per-route First Load JS budget check. Reads
 * .next/diagnostics/route-bundle-stats.json — verified present in Next 16
 * under Turbopack, listing `route`, `firstLoadUncompressedJsBytes` and
 * `firstLoadChunkPaths` per route. `.next/app-build-manifest.json` does
 * NOT exist under Turbopack; this script does not look for it. `next
 * build` stdout is not parsed either — Next 16 no longer prints route
 * sizes at all.
 *
 * Brotli quality 11 is the primary figure (see BUILD-PLAN §1.17 — the
 * budget's own wording allows "gzipped OR brotli", and brotli is what
 * Vercel actually serves to every modern browser). Gzip is reported
 * alongside for reference. The `noModule` polyfill chunk is correctly
 * absent from the stats file already — modern browsers never fetch it, so
 * it must not be counted, and Next's own diagnostics agree.
 *
 * This never weakens the budget to pass — see docs/calden-performance-budget.md:
 * "Do not weaken any budget to make a check pass." A failing route here
 * means fix the route, not raise the number.
 */
import { readFileSync, existsSync } from "node:fs";
import { gzipSync, brotliCompressSync, constants } from "node:zlib";

const STATS_PATH = ".next/diagnostics/route-bundle-stats.json";
const BUDGET_BYTES = 120 * 1024;

if (!existsSync(STATS_PATH)) {
  console.error(`${STATS_PATH} not found — run "pnpm build" first.`);
  process.exit(1);
}

const stats = JSON.parse(readFileSync(STATS_PATH, "utf8"));

let anyOver = false;
const rows = [];

for (const route of stats) {
  let rawTotal = 0;
  let gzipTotal = 0;
  let brotliTotal = 0;

  for (const chunkPath of route.firstLoadChunkPaths) {
    if (!existsSync(chunkPath)) {
      console.error(`Chunk referenced by ${route.route} is missing: ${chunkPath}`);
      process.exit(1);
    }
    const buf = readFileSync(chunkPath);
    rawTotal += buf.length;
    gzipTotal += gzipSync(buf, { level: 9 }).length;
    brotliTotal += brotliCompressSync(buf, {
      params: { [constants.BROTLI_PARAM_QUALITY]: 11 },
    }).length;
  }

  const over = brotliTotal > BUDGET_BYTES;
  anyOver = anyOver || over;

  rows.push({
    route: route.route,
    rawKB: (rawTotal / 1024).toFixed(1),
    gzipKB: (gzipTotal / 1024).toFixed(1),
    brotliKB: (brotliTotal / 1024).toFixed(1),
    over,
    deltaKB: ((brotliTotal - BUDGET_BYTES) / 1024).toFixed(1),
  });
}

const routeWidth = Math.max(...rows.map((r) => r.route.length), "Route".length);
console.log(
  "Route".padEnd(routeWidth),
  "raw".padStart(9),
  "gzip".padStart(9),
  "brotli".padStart(9),
  " vs 120 KB (brotli)",
);
console.log("-".repeat(routeWidth + 45));
for (const r of rows) {
  const verdict = r.over ? `OVER by ${Math.abs(r.deltaKB)} KB` : `${Math.abs(r.deltaKB)} KB spare`;
  console.log(
    r.route.padEnd(routeWidth),
    `${r.rawKB} KB`.padStart(9),
    `${r.gzipKB} KB`.padStart(9),
    `${r.brotliKB} KB`.padStart(9),
    " " + verdict,
  );
}

if (anyOver) {
  console.error("\nOne or more routes exceed the 120 KB brotli First Load JS budget.");
  process.exit(1);
}

console.log("\nAll routes within budget.");
