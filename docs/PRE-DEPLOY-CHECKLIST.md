# Pre-deploy checklist

Filled in Phase 9.

---

## Budget document integrity

The binding performance budget is `docs/calden-performance-budget.md`. It is never
edited to make a check pass. Recorded at Phase 0:

| | |
|---|---|
| SHA-256 | `10cadec25b00e317982d4960d602510db7d165dbce737afba85e197deff01a52` |
| Size | 6960 bytes |
| Recorded | 2026-08-19 (Phase 0) |

Verify at any time:

```bash
shasum -a 256 docs/calden-performance-budget.md
```

If this no longer matches, someone changed the budget. Find out who and why before
trusting any passing check.
