# Testing

Run the narrowest relevant check first, then broader checks in proportion to risk.

```bash
pnpm lint
pnpm build
pnpm test
```

Backend integration tests require a reachable PostgreSQL database. For commerce flows, verify inventory limits, sold visibility, INR totals, COD-only selection, order creation versus payment collection, upload abstraction, validation failures, and authorization boundaries. For custom enquiries, verify authenticated status/note updates, allowed transitions, and rejection of invalid state jumps.

For vendor flows, verify unauthenticated rejection, owner-scoped listings, file type/size validation, pending-only approval/rejection, approval-created product price and inventory, storefront publication only after approval, rejection-note visibility, and cleanup when product creation fails.
