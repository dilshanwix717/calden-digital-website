#!/usr/bin/env node
/**
 * Static accessibility gate. Fetches each built route from a running
 * `pnpm start` and asserts, by parsing the HTML:
 *   - exactly one <h1> per page
 *   - heading levels never skip on the way down (h1 -> h3 is a failure)
 *   - every <img> has an alt attribute (present, possibly empty)
 *   - every <a> and <button> has discernible text or an aria-label
 *   - no <a href="#">
 *   - <html lang="en"> present
 *   - gold usage (--accent-gold / text-accent / #D4AF37) only on the
 *     allowlisted files — the mechanical enforcement of BUILD-PLAN §1.5
 *
 * This is a static check, not a replacement for the manual keyboard and
 * screen-reader pass (BUILD-PLAN §Phase 9, item 9) or axe DevTools — it
 * catches what's mechanically checkable from server-rendered HTML alone.
 *
 * React's streamed RSC payload duplicates rendered content later in the
 * same HTML document as a JSON blob inside a <script> tag — this script
 * only parses the DOM BEFORE that script tag, or every count would be
 * doubled.
 */
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

const BASE_URL = process.env.A11Y_BASE_URL ?? "http://localhost:3000";

const ROUTES = ["/", "/work", "/work/susila", "/services", "/about", "/contact", "/faq", "/privacy"];

const GOLD_PATTERNS = [/text-accent\b/, /--accent-gold/, /#D4AF37/i, /#E0BE50/i];
const GOLD_ALLOWLIST = [
  "components/layout/Footer.tsx",
  "components/ui/Logo.tsx",
  "app/icon.svg",
  "public/images/og", // generated OG PNGs reference the gold literally, not code
  "lib/seo-json-ld.ts", // logo/image URLs, not a colour value
];

function domOnly(html) {
  const cut = html.indexOf("<script>self.__next_f");
  return cut > 0 ? html.slice(0, cut) : html;
}

function checkPage(route, html) {
  const errors = [];
  const dom = domOnly(html);

  const h1Matches = dom.match(/<h1[^>]*>/g) ?? [];
  if (h1Matches.length !== 1) {
    errors.push(`expected exactly one <h1>, found ${h1Matches.length}`);
  }

  const headingLevels = [...dom.matchAll(/<h([1-6])[^>]*>/g)].map((m) => Number(m[1]));
  let prev = 0;
  for (const level of headingLevels) {
    if (prev && level > prev + 1) {
      errors.push(`heading order skips a level: h${prev} -> h${level}`);
    }
    prev = level;
  }

  const imgTags = dom.match(/<img\b[^>]*>/g) ?? [];
  for (const img of imgTags) {
    if (!/\balt=/.test(img)) {
      errors.push(`<img> without an alt attribute: ${img.slice(0, 80)}`);
    }
  }

  // An element's accessible name can come from its own text, an
  // aria-label, OR a descendant <img alt="..."> (the standard pattern for
  // an image-only link/button, e.g. the work-index media links). Checking
  // text content alone flags every image-only link as a false positive —
  // found running this script for the first time against the real site.
  function hasAccessibleName(attrs, inner) {
    if (/aria-label="[^"]+"/.test(attrs)) return true;
    const text = inner.replace(/<[^>]+>/g, "").trim();
    if (text.length > 0) return true;
    const imgAlt = [...inner.matchAll(/<img\b[^>]*\balt="([^"]*)"/g)];
    return imgAlt.some(([, alt]) => alt.trim().length > 0);
  }

  const anchorTags = [...dom.matchAll(/<a\b([^>]*)>(.*?)<\/a>/gs)];
  for (const [full, attrs, inner] of anchorTags) {
    if (/href="#"/.test(attrs)) {
      errors.push(`<a href="#">: ${full.slice(0, 80)}`);
    }
    if (!hasAccessibleName(attrs, inner)) {
      errors.push(`<a> with no discernible text or aria-label: ${full.slice(0, 80)}`);
    }
  }

  const buttonTags = [...dom.matchAll(/<button\b([^>]*)>(.*?)<\/button>/gs)];
  for (const [full, attrs, inner] of buttonTags) {
    if (!hasAccessibleName(attrs, inner)) {
      errors.push(`<button> with no discernible text or aria-label: ${full.slice(0, 80)}`);
    }
  }

  if (!/<html[^>]*\blang="en"/.test(html)) {
    errors.push('<html lang="en"> not found');
  }

  return errors;
}

function walkFiles(dir, exts) {
  const out = [];
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const entry of entries) {
    if (entry.name === "node_modules" || entry.name.startsWith(".")) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...walkFiles(full, exts));
    } else if (exts.some((e) => entry.name.endsWith(e))) {
      out.push(full);
    }
  }
  return out;
}

function checkGoldUsage() {
  const errors = [];
  const roots = ["app", "components", "lib"];
  const files = roots.flatMap((r) => walkFiles(r, [".ts", ".tsx"]));

  for (const file of files) {
    const relative = file;
    if (GOLD_ALLOWLIST.some((allowed) => relative.startsWith(allowed))) continue;
    const content = readFileSync(file, "utf8");
    for (const pattern of GOLD_PATTERNS) {
      if (pattern.test(content)) {
        errors.push(`${relative}: gold reference (${pattern}) outside the allowlist`);
      }
    }
  }
  return errors;
}

async function main() {
  let hasErrors = false;

  for (const route of ROUTES) {
    const res = await fetch(`${BASE_URL}${route}`);
    if (!res.ok) {
      console.error(`✗ ${route}: HTTP ${res.status}`);
      hasErrors = true;
      continue;
    }
    const html = await res.text();
    const errors = checkPage(route, html);
    if (errors.length > 0) {
      hasErrors = true;
      console.error(`✗ ${route}`);
      for (const e of errors) console.error(`    ${e}`);
    } else {
      console.log(`✓ ${route}`);
    }
  }

  const goldErrors = checkGoldUsage();
  if (goldErrors.length > 0) {
    hasErrors = true;
    console.error("✗ gold usage outside allowlist:");
    for (const e of goldErrors) console.error(`    ${e}`);
  } else {
    console.log("✓ gold usage confined to the allowlist");
  }

  if (hasErrors) {
    console.error("\nStatic accessibility check failed.");
    process.exit(1);
  }
  console.log("\nAll static accessibility checks passed.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
