# Colourpalet

Artwork ecommerce MVP built as a pnpm monorepo with a Next.js storefront and Medusa backend/Admin backed by local PostgreSQL. The only MVP payment method is Cash on Delivery and development uploads use Medusa's Local File Provider.

## Applications

- `apps/backend`: Medusa server and Admin at `http://localhost:9000/app`
- `apps/storefront`: Next.js storefront at `http://localhost:8000`

## Local setup

Install Node.js 20.19+ or 22.12+ (below 25), pnpm 10+, and PostgreSQL 15+. Then follow `LOCAL_SETUP.md`.

## Commands

```bash
pnpm install
pnpm backend:seed
pnpm dev
pnpm lint
pnpm build
```

Project decisions are documented in `AGENTS.md`, `ARCHITECTURE.md`, `SCOPE.md`, and `BUSINESS_RULES.md`.
