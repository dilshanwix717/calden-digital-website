/**
 * Lighthouse CI config. Mobile preset, Slow 4G + 4x CPU throttling
 * (Lighthouse's mobile preset default), 3 runs, median — the budget
 * document is explicit about median, not best-of-three. Asserts exactly
 * the numbers in docs/calden-performance-budget.md.
 *
 * INP is not asserted here — it's a field metric, not measurable in a lab
 * run. TBT is its lab proxy; the <=150ms TBT assertion below stands in for
 * it. Real INP is covered by Vercel Speed Insights once deployed.
 */
module.exports = {
  ci: {
    collect: {
      url: [
        "http://localhost:3000/",
        "http://localhost:3000/work",
        "http://localhost:3000/work/susila",
        "http://localhost:3000/services",
        "http://localhost:3000/about",
        "http://localhost:3000/contact",
      ],
      startServerCommand: "pnpm start",
      startServerReadyPattern: "Ready in",
      numberOfRuns: 3,
      settings: {
        formFactor: "mobile",
        throttling: {
          rttMs: 150,
          throughputKbps: 1638.4, // Slow 4G
          cpuSlowdownMultiplier: 4,
        },
        screenEmulation: {
          mobile: true,
          width: 390,
          height: 844,
          deviceScaleFactor: 3,
          disabled: false,
        },
      },
    },
    assert: {
      assertions: {
        "categories:performance": ["error", { minScore: 0.95 }],
        "categories:accessibility": ["error", { minScore: 1 }],
        "categories:best-practices": ["error", { minScore: 1 }],
        "categories:seo": ["error", { minScore: 1 }],
        "largest-contentful-paint": ["error", { maxNumericValue: 2000 }],
        "cumulative-layout-shift": ["error", { maxNumericValue: 0.05 }],
        "total-blocking-time": ["error", { maxNumericValue: 150 }],
        "first-contentful-paint": ["error", { maxNumericValue: 1200 }],
        "speed-index": ["error", { maxNumericValue: 2500 }],
      },
      aggregationMethod: "median",
    },
    upload: {
      target: "temporary-public-storage",
    },
  },
};
