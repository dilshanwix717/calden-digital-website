import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // The Claude Design handoff is reference material, not source. It is
    // React-18-in-the-browser prototype code and is never built or shipped.
    // Read it, do not lint it.
    "design_handoff_calden_site/**",
  ]),
]);

export default eslintConfig;
