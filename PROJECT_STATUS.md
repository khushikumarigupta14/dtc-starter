# Project Status and AI Handoff

Last reviewed: 26 September 2026

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

The custom form is an enquiry, not a cart item or order. The storefront server action posts to `/store/custom-artwork-requests`; the backend validates with Zod and runs a Medusa workflow that writes through the custom module. Admin APIs list and update requests, and the Medusa Admin page at `/app/custom-artwork-requests` lets operators record internal notes and move enquiries through controlled states. A customer can arrive from a sold artwork and retain its product ID as inspiration.

Important entry points:

- `apps/storefront/src/app/[countryCode]/(main)/custom-artwork/page.tsx`
- `apps/storefront/src/modules/custom-artwork/components/request-form/index.tsx`
- `apps/storefront/src/lib/data/custom-artwork-requests.ts`
- `apps/backend/src/api/store/custom-artwork-requests/route.ts`
- `apps/backend/src/api/admin/custom-artwork-requests/route.ts`
- `apps/backend/src/admin/routes/custom-artwork-requests/page.tsx`
- `apps/backend/src/workflows/create-custom-artwork-request.ts`
- `apps/backend/src/modules/custom-artwork-request`

### Vendor artwork submissions

Authenticated customers can use the themed account route at `/[countryCode]/account/vendor-products` as a vendor studio. They can submit an artwork image, description, medium, dimensions, INR price, and quantity, then track awaiting-review, published, or needs-changes status. Store API reads are owner-scoped from the authenticated customer identity; the client cannot choose an owner ID.

The Medusa Admin **Vendor review** page lists submissions. Approval creates a published Medusa product in the Colourpalet sales channel with its submitted INR price and inventory at the studio stock location. Rejection preserves the submission and returns a review note to the vendor. Vendors do not receive Medusa Admin access.

Important entry points:

- `apps/storefront/src/app/[countryCode]/(main)/account/@dashboard/vendor-products/page.tsx`
- `apps/storefront/src/lib/data/vendor-products.ts`
- `apps/backend/src/api/store/vendor-products/route.ts`
- `apps/backend/src/api/admin/vendor-products`
- `apps/backend/src/admin/routes/vendor-products/page.tsx`
- `apps/backend/src/modules/vendor-product-submission`

### Brand and information pages

The storefront includes About, Contact, FAQ, Shipping & Returns, Privacy, Terms, and an editorial page system. Navigation and footer expose these destinations. Legal and shipping content is draft copy, not production-approved policy.

## Recently completed

- Made the backend Jest scripts cross-platform and corrected the test environment import so the suite runs on Windows.
- Added eight focused API unit tests covering custom-enquiry validation/normalization, vendor authentication and owner-scoped listings, submission validation, required rejection notes, and pending-only rejection.
- Added clean-PostgreSQL vendor integration coverage for authenticated owner scoping and approval-created publication, including INR price, sales-channel assignment, metadata, inventory quantity/location, and persisted review state.
- Made the foundation seed create its required shipping profile when running against a freshly migrated database instead of assuming one already exists.
- Synchronized installed Medusa dependencies with the locked `2.21.0` versions and added a storefront server-action precheck that rejects invalid, sold, or over-inventory add-to-cart quantities using a live uncached variant lookup plus the cart's existing quantity.
- Added a clean-PostgreSQL COD checkout integration test that creates a real order through `pp_system_default` and verifies the order has no captured/collected payment.
- Added clean-PostgreSQL coverage proving validated custom-artwork enquiries persist normalized data and published sold artwork remains available through the public Store API at zero inventory.
- Added a concurrent clean-PostgreSQL checkout test proving Medusa's inventory-item reservation lock permits exactly one order when two carts compete for a one-of-one artwork.
- Added clean-PostgreSQL HTTP authorization coverage proving custom Admin listings and vendor approval reject anonymous and customer credentials, with rejected mutations leaving submissions unchanged.
- Verified the positive Admin HTTP path with a real User/Auth Identity fixture: authenticated Admins can list custom resources and approve a pending vendor submission into a published product.
- Added an authenticated custom-enquiry operator workflow with internal notes and controlled `new → under review → quote sent → approved/rejected/cancelled` transitions, including terminal-state reopening to review.
- Refreshed the storefront with the centralized Gallery Quiet theme: shared color, typography, spacing, focus, and button tokens now drive the homepage, navigation, product previews, collection rails, and footer.
- Rebuilt the homepage around artwork-first hero imagery, category discovery, editorial curation, Medusa-backed featured originals, an honest empty-catalog state, and a custom-artwork enquiry banner.
- Added responsive generated imagery for the hero, art categories, and custom-artwork section; desktop and mobile visual QA passed without horizontal overflow.

- Cart retrieval now explicitly requests `items.variant.inventory_quantity`.
- Managed-inventory quantity selectors use the current Medusa inventory value instead of a hard-coded limit, retain the current quantity when availability changes, disable during updates, and no longer render a duplicate option.
- The server action rejects non-integer or sub-one quantities before calling Medusa; Medusa remains authoritative and performs final inventory validation.
- Medusa Admin now includes a read-only Custom artwork requests page with loading, error/retry, empty, and populated states.
- Added a Gallery Quiet vendor studio, authenticated owner-scoped artwork submissions, Admin approval/rejection, File Module uploads, and approval-created Medusa products with INR price and inventory.

## Known gaps and risks

### P0 — Correctness before release

1. Define any fine-grained operator roles the business needs before adding role-specific authorization; authenticated Admin success, anonymous/customer isolation, inventory races, sold visibility, COD semantics, and custom-request persistence now have clean-database coverage.
2. Resolve the repository's existing unmerged `apps/storefront/tsconfig.tsbuildinfo` Git state without discarding user work. The generated file should normally not be a meaningful source artifact.

### P1 — Required production decisions

1. Replace placeholder artist biography, studio story, and final imagery.
2. Add verified business name, address, email/phone, privacy contact, and customer-support process.
3. Obtain owner/legal approval for Privacy, Terms, Shipping/Returns, cancellation, custom-work, copyright, and jurisdiction language.
4. Configure real shipping areas, prices, service levels, tax behavior, and COD eligibility in Medusa.
5. Choose and configure production deployment, PostgreSQL, File Module provider, secrets, backups, restore procedure, logs, monitoring, and alerting.
6. Add transactional customer/operator notifications or document the manual operational process.

### P2 — Operations and experience

1. Add pagination/search when enquiry volume requires it; the MVP currently returns requests newest-first.
2. Complete responsive, keyboard, screen-reader, contrast, error/empty/loading, SEO, metadata, performance, and image optimization review.
3. Add end-to-end coverage for browse → cart → COD checkout → confirmation and sold artwork → custom request.
4. Verify all footer links preserve the country-code route and add automated navigation coverage.
5. Define vendor eligibility/onboarding, editing/resubmission, commission/payout, order visibility, and fulfilment policy; add authorization and approval integration coverage before production use.

## Recommended next task order

1. Define final business, contact, shipping, return, tax, and legal inputs with the owner.
2. Test the complete Medusa flows against a clean PostgreSQL database.
3. Agree and implement status transitions/internal notes in the existing custom-request Admin page.
4. Prepare production infrastructure, backups, secrets, email, monitoring, and a rollback plan.
5. Run accessibility, performance, security, responsive, and content QA; then complete launch acceptance.

## Validation baseline

On 26 September 2026:

- `pnpm --dir apps/backend test:integration:http -- --runTestsByPath integration-tests/http/custom-and-sold.spec.ts` passed: 1 suite and 2 clean-database tests.
- `pnpm --dir apps/backend test:integration:http -- --runTestsByPath integration-tests/http/cod-checkout.spec.ts` passed: 1 suite and 2 clean-database tests, including simultaneous checkout contention for stock `1`.
- `pnpm --dir apps/backend test:integration:http -- --runTestsByPath integration-tests/http/admin-authorization.spec.ts` passed: 1 suite and 3 clean-database HTTP authorization tests.
- `pnpm --dir apps/backend exec tsc --noEmit` passed after adding the sold-artwork and custom-request coverage.
- `pnpm --dir apps/backend exec tsc --noEmit -p src/admin/tsconfig.json` passed after adding custom-request status and note controls.
- `pnpm --dir apps/backend exec medusa db:migrate` applied `Migration20260926091347` for custom-request internal notes.
- PostgreSQL-backed custom-request persistence/normalization, public sold-artwork visibility, COD semantics, atomic checkout inventory reservation, anonymous/customer isolation, and authenticated Admin listing/approval are covered. Future role-specific authorization depends on the operator-role policy.

On 23 September 2026:

- `pnpm --dir apps/backend test:unit` passed: 3 suites and 8 tests.
- `pnpm --dir apps/backend test:integration:http -- --runTestsByPath integration-tests/http/vendor-products.spec.ts` passed: 1 suite and 2 clean-database tests.
- `pnpm --dir apps/backend exec tsc --noEmit` passed.
- `pnpm --dir apps/storefront exec tsc --noEmit` passed after the live add-to-cart inventory precheck.
- PostgreSQL-backed vendor ownership, approval publication, and COD order-versus-collected-payment semantics are covered.
- `pnpm --dir apps/backend test:integration:http -- --runTestsByPath integration-tests/http/cod-checkout.spec.ts` passed: 1 clean-database COD checkout test.

On 21 September 2026:

- `pnpm --dir apps/storefront exec tsc --noEmit` passed after the Gallery Quiet redesign.
- `pnpm --dir apps/storefront build` passed; product static-path fetching still reported `fetch failed` when the backend was unavailable during that build.
- Playwright desktop (1440 × 1100) and mobile (390 × 844) homepage captures passed visual QA with no horizontal overflow.
- Primary homepage actions navigated to the localized store and custom-artwork routes.

On 20 September 2026:

- `pnpm --dir apps/storefront exec tsc --noEmit` passed, including the inventory-aware cart update.
- `pnpm --dir apps/storefront build` passed.
- `pnpm --dir apps/backend exec tsc --noEmit -p src/admin/tsconfig.json` passed for the custom Admin page.
- `pnpm --dir apps/backend exec tsc --noEmit` passed after the vendor submission APIs and approval workflow.
- `pnpm --dir apps/storefront exec tsc --noEmit` passed after the themed vendor dashboard.
- `pnpm --dir apps/backend exec medusa db:migrate` applied `Migration20260921150000` for vendor submissions.
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
