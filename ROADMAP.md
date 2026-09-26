# Roadmap

Status key: complete means a working foundation exists; partial means the flow exists but still needs the listed production or quality work.

- Phase 0 — Foundation: **partial**. PostgreSQL, Medusa/Admin, Next.js, India/INR, COD, local uploads, and documentation exist. Production hosting, storage, backups, secrets, and monitoring remain.
- Phase 1 — Catalog: **partial**. Home, gallery/detail, images, categories/collections, price, stock, and sold UI exist. The homepage now uses the centralized Gallery Quiet visual system with artwork-first discovery, responsive generated imagery, and a truthful empty-catalog state. Cart quantity follows Medusa inventory, and clean-PostgreSQL coverage confirms published artwork remains Store-API-visible at zero stock; broad catalog QA with final content remains.
- Phase 2 — Cart and COD checkout: **partial**. Cart, contact/address, shipping, COD, order, and confirmation exist. Clean-PostgreSQL coverage verifies COD order creation does not record collected payment and Medusa's locked inventory reservation allows only one simultaneous checkout for a one-of-one artwork. Add-to-cart performs a live server-action inventory precheck; broader integration testing and production shipping/tax configuration remain.
- Phase 3 — Artist content: **partial**. About, studio/process, Contact, FAQ, Shipping/Returns, Privacy, and Terms routes exist. Final artist content, contact details, imagery, and policy/legal approval remain.
- Phase 4 — Custom artwork requests: **complete foundation**. Form, optional source reference, validation, custom Medusa module/workflows, Store API, and authenticated Admin listing/update APIs exist. Operators can record internal notes and use controlled enquiry status transitions. Clean-PostgreSQL coverage verifies persistence, authorization, valid updates, and invalid-transition rejection; notifications and advanced quoting remain future work.
- Phase 5 — Customer account: **complete foundation**. Authentication, profile, addresses, order history, and order details exist; production acceptance testing remains.
- Phase 6 — Quality: **in progress**. Storefront typecheck and production build pass. Backend API unit coverage exercises enquiry validation, vendor owner scoping, and rejection-state rules through a cross-platform Jest runner. Clean-PostgreSQL integration tests cover vendor ownership and approval publication, COD payment semantics, concurrent inventory reservation, custom-request persistence, sold-artwork visibility, anonymous/customer isolation, and authenticated Admin listing/approval; future role-specific authorization, accessibility, SEO, performance, security, and end-to-end review remain.
- Phase 7 — Vendor submissions: **partial**. Authenticated vendors can submit artwork from a Gallery Quiet account dashboard and track review status. Admin can approve into the Medusa catalog or reject with a note. Database-backed tests verify owner isolation and approval-created INR pricing, sales-channel publication, and inventory. Vendor onboarding/roles, edits/resubmission, payouts, commissions, fulfilment, analytics, and broader authorization tests remain.

## Next milestone

Make the current MVP release-safe before expanding scope:

1. Finalize business, contact, shipping, returns, tax, and legal inputs.
2. Run full backend/integration and end-to-end commerce tests with PostgreSQL.
3. Add vendor-role/onboarding policy and integration tests for ownership and approval publication.
4. Configure production infrastructure and complete launch QA.

See `PROJECT_STATUS.md` for implementation entry points, known risks, validation baseline, and detailed handoff guidance.

Future and uncommitted: online payments, courier integration, reviews, wishlists, analytics, advanced quote workflow, native apps, multi-language/currency, and other items excluded by `SCOPE.md`.
