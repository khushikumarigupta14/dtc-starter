# Testing

Run the narrowest relevant check first, then broader checks in proportion to risk.

```bash
pnpm lint
pnpm build
pnpm test
```

Storefront navigation E2E tests require the backend and storefront development servers on ports `9000` and `8000`. Install a Playwright browser once with `pnpm exec playwright install chromium`, then run:

```bash
pnpm test:e2e:storefront
```

When using an installed Chrome browser instead of Playwright Chromium, set `PLAYWRIGHT_CHANNEL=chrome`. Override the storefront origin with `STOREFRONT_URL` when it is not `http://localhost:8000`.

GitHub Actions runs the same suite for pull requests, pushes to `main`, and manual dispatches. The workflow provisions PostgreSQL, migrates and seeds Medusa, masks the ephemeral publishable key, starts both applications, waits for health checks, and uploads Playwright traces, screenshots, videos, and server logs when a run fails.

Backend integration tests require a reachable PostgreSQL database. For commerce flows, verify inventory limits, sold visibility, INR totals, COD-only selection, order creation versus payment collection, upload abstraction, validation failures, and authorization boundaries. For custom enquiries, verify authenticated status/note updates, allowed transitions, and rejection of invalid state jumps.

For vendor flows, verify unauthenticated rejection, owner-scoped listings, file type/size validation, pending-only approval/rejection, approval-created product price and inventory, storefront publication only after approval, rejection-note visibility, and cleanup when product creation fails.
