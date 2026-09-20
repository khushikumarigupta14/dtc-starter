# Project Status and AI Handoff

Last reviewed: 20 September 2026

This is the first file an AI agent should read after the mandatory project rules. It describes the implemented system, known gaps, and recommended next work. Update it whenever a feature is added, removed, or materially changed.

## Snapshot

Colourpalet is an artwork ecommerce MVP. It has a Next.js storefront and Medusa backend/Admin using PostgreSQL. Prices and inventory come from Medusa. Cash on Delivery through `pp_system_default` is the only MVP payment method. Local development uploads use Medusa's File Module provider.

Current state: the main customer journey is implemented and builds successfully. The project is not production-ready because policy/business values, production infrastructure, broader tests, and several operational details remain unfinished.

## Repository map

- `apps/storefront/src/app/[countryCode]/(main)`: localized storefront routes.
- `apps/storefront/src/modules`: storefront UI and feature components.
- `apps/storefront/src/lib/data`: Medusa SDK calls and server actions.
- `apps/backend/src/api`: custom Store/Admin API routes.
- `apps/backend/src/modules/custom-artwork-request`: custom enquiry data model and service.
- `apps/backend/src/workflows`: state-changing custom workflows.
- `apps/backend/src/migration-scripts/initial-data-seed.ts`: development seed and COD/region setup.
- Root Markdown files: scope, architecture, rules, testing, operations, roadmap, and status.

## Implemented flows

### Catalog and artwork availability

Catalog data, images, collections, categories, INR prices, and inventory are read from Medusa. The storefront routes are `/[countryCode]/store`, `/products/[handle]`, `/collections/[handle]`, and `/categories/...`. Product actions use variant inventory to prevent adding an unavailable original. A sold product stays published, displays sold messaging, and can link to a custom request with `inspired_by=<product-id>`.

Important entry points:

- `apps/storefront/src/lib/data/products.ts`
- `apps/storefront/src/modules/products/components/product-actions/index.tsx`
- `apps/storefront/src/modules/products/components/product-preview/index.tsx`

### Cart and COD checkout

Medusa owns cart totals, shipping options, checkout state, and order creation. The only intended payment option is `pp_system_default`, displayed publicly as “Cash on Delivery.” Order creation must never be described as payment collection.

Important entry points:

- `apps/storefront/src/lib/data/cart.ts`
- `apps/storefront/src/lib/data/payment.ts`
- `apps/storefront/src/modules/checkout`
- `apps/storefront/src/lib/constants.tsx`

### Customer accounts and orders

Medusa customer APIs provide sign-in, registration, profile, addresses, order history, and order details under `/[countryCode]/account`.

Important entry points:

- `apps/storefront/src/lib/data/customer.ts`
- `apps/storefront/src/lib/data/orders.ts`
- `apps/storefront/src/modules/account`

### Custom artwork enquiries

The custom form is an enquiry, not a cart item or order. The storefront server action posts to `/store/custom-artwork-requests`; the backend validates with Zod and runs a Medusa workflow that writes through the custom module. An Admin API can list requests at `/admin/custom-artwork-requests`. A customer can arrive from a sold artwork and retain its product ID as inspiration.

Important entry points:

- `apps/storefront/src/app/[countryCode]/(main)/custom-artwork/page.tsx`
- `apps/storefront/src/modules/custom-artwork/components/request-form/index.tsx`
- `apps/storefront/src/lib/data/custom-artwork-requests.ts`
- `apps/backend/src/api/store/custom-artwork-requests/route.ts`
- `apps/backend/src/api/admin/custom-artwork-requests/route.ts`
- `apps/backend/src/workflows/create-custom-artwork-request.ts`
- `apps/backend/src/modules/custom-artwork-request`

### Brand and information pages

The storefront includes About, Contact, FAQ, Shipping & Returns, Privacy, Terms, and an editorial page system. Navigation and footer expose these destinations. Legal and shipping content is draft copy, not production-approved policy.

## Recently completed

- Cart retrieval now explicitly requests `items.variant.inventory_quantity`.
- Managed-inventory quantity selectors use the current Medusa inventory value instead of a hard-coded limit, retain the current quantity when availability changes, disable during updates, and no longer render a duplicate option.
- The server action rejects non-integer or sub-one quantities before calling Medusa; Medusa remains authoritative and performs final inventory validation.

## Known gaps and risks

### P0 — Correctness before release

1. Run full backend integration tests with PostgreSQL, including inventory races, sold visibility, COD semantics, custom-request validation, and Admin authorization.
2. Resolve the repository's existing unmerged `apps/storefront/tsconfig.tsbuildinfo` Git state without discarding user work. The generated file should normally not be a meaningful source artifact.

### P1 — Required production decisions

1. Replace placeholder artist biography, studio story, and final imagery.
2. Add verified business name, address, email/phone, privacy contact, and customer-support process.
3. Obtain owner/legal approval for Privacy, Terms, Shipping/Returns, cancellation, custom-work, copyright, and jurisdiction language.
4. Configure real shipping areas, prices, service levels, tax behavior, and COD eligibility in Medusa.
5. Choose and configure production deployment, PostgreSQL, File Module provider, secrets, backups, restore procedure, logs, monitoring, and alerting.
6. Add transactional customer/operator notifications or document the manual operational process.

### P2 — Operations and experience

1. Build a Medusa Admin extension for viewing/updating custom artwork request statuses if the Admin API alone is not sufficient for the operator.
2. Add enquiry status transitions and notes only after the operator workflow is agreed.
3. Complete responsive, keyboard, screen-reader, contrast, error/empty/loading, SEO, metadata, performance, and image optimization review.
4. Add end-to-end coverage for browse → cart → COD checkout → confirmation and sold artwork → custom request.
5. Verify all footer links preserve the country-code route and add automated navigation coverage.

## Recommended next task order

1. Define final business, contact, shipping, return, tax, and legal inputs with the owner.
2. Test the complete Medusa flows against a clean PostgreSQL database.
3. Decide the custom-request Admin workflow and implement only the missing operator UI/status behavior.
4. Prepare production infrastructure, backups, secrets, email, monitoring, and a rollback plan.
5. Run accessibility, performance, security, responsive, and content QA; then complete launch acceptance.

## Validation baseline

On 20 September 2026:

- `pnpm --dir apps/storefront exec tsc --noEmit` passed, including the inventory-aware cart update.
- `pnpm --dir apps/storefront build` passed.
- During the build, product static-path fetching reported `fetch failed` because the backend was unavailable; the build still completed.
- Backend integration tests were not run in that review.

Do not treat this baseline as current after new changes. Run the relevant checks again.

## Rules for future agents

1. Read `AGENTS.md` and every document it lists before editing.
2. Check `git status` first. Preserve unrelated and pre-existing work.
3. Confirm a claimed gap in code before implementing it; this document may become stale.
4. Keep `PROJECT_STATUS.md`, `ROADMAP.md`, and any affected rule/setup document current in the same change.
5. In the final handoff, report behavior, changed files, checks, known failures, exclusions, assumptions, and the single best next task.
6. Never silently introduce online payments, new storage providers, databases, or platforms outside the approved scope.