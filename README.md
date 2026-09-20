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

## Documentation map

- Start with `PROJECT_STATUS.md` for what exists, known gaps, and the recommended next task.
- Use `PROJECT_MANAGEMENT.md` for workflow, ownership, content operations, and release management.
- `ARCHITECTURE.md`, `SCOPE.md`, `BUSINESS_RULES.md`, and `API_RULES.md` define technical and product boundaries.
- `LOCAL_SETUP.md`, `TESTING.md`, and `REVIEW_CHECKLIST.md` explain setup and verification.
- `ROADMAP.md` tracks delivery phases.

AI agents must follow `AGENTS.md` before editing.
