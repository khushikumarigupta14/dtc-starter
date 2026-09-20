# Testing

Run the narrowest relevant check first, then broader checks in proportion to risk.

```bash
pnpm lint
pnpm build
pnpm test
```

Backend integration tests require a reachable PostgreSQL database. For commerce flows, verify inventory limits, sold visibility, INR totals, COD-only selection, order creation versus payment collection, upload abstraction, validation failures, and authorization boundaries.
