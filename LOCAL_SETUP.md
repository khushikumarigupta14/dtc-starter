# Local Setup

Prerequisites: Node.js 20.19+ or 22.12+ (below 25), pnpm 10+, Git, and PostgreSQL 15+.

1. Create a PostgreSQL database named `colourpalet`.
2. Copy `apps/backend/.env.template` to `apps/backend/.env`, set the actual `DATABASE_URL`, and generate unique JWT/cookie secrets.
3. Run `pnpm install`, then `pnpm --dir apps/backend exec medusa db:migrate`.
4. Run `pnpm backend:seed`. Copy the logged publishable key.
5. Create an admin with `pnpm --dir apps/backend exec medusa user -e <email> -p <password>`.
6. Copy `apps/storefront/.env.template` to `apps/storefront/.env.local` and set `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY`.
7. Run `pnpm dev`. Open Admin at `http://localhost:9000/app` and the storefront at `http://localhost:8000/in`.

Environment files contain secrets and must not be committed.
