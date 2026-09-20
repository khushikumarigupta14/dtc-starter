# Roadmap

Status key: complete means a working foundation exists; partial means the flow exists but still needs the listed production or quality work.

- Phase 0 — Foundation: **partial**. PostgreSQL, Medusa/Admin, Next.js, India/INR, COD, local uploads, and documentation exist. Production hosting, storage, backups, secrets, and monitoring remain.
- Phase 1 — Catalog: **partial**. Home, gallery/detail, images, categories/collections, price, stock, and sold UI exist. Cart quantity now follows Medusa inventory; broad catalog QA remains.
- Phase 2 — Cart and COD checkout: **partial**. Cart, contact/address, shipping, COD, order, and confirmation exist. Full integration/race testing and production shipping/tax configuration remain.
- Phase 3 — Artist content: **partial**. About, studio/process, Contact, FAQ, Shipping/Returns, Privacy, and Terms routes exist. Final artist content, contact details, imagery, and policy/legal approval remain.
- Phase 4 — Custom artwork requests: **partial**. Form, optional source reference, validation, custom Medusa module/workflow, Store API, and Admin listing API exist. Operator-facing Admin UI and an agreed status/notes workflow remain.
- Phase 5 — Customer account: **complete foundation**. Authentication, profile, addresses, order history, and order details exist; production acceptance testing remains.
- Phase 6 — Quality: **in progress**. Storefront typecheck and production build pass. Accessibility, responsive, SEO, performance, security, backend integration, and end-to-end review remain.

## Next milestone

Make the current MVP release-safe before expanding scope:

1. Finalize business, contact, shipping, returns, tax, and legal inputs.
2. Run full backend/integration and end-to-end commerce tests with PostgreSQL.
3. Complete the operator workflow for custom artwork requests.
4. Configure production infrastructure and complete launch QA.

See `PROJECT_STATUS.md` for implementation entry points, known risks, validation baseline, and detailed handoff guidance.

Future and uncommitted: online payments, courier integration, reviews, wishlists, analytics, advanced quote workflow, native apps, multi-language/currency, and other items excluded by `SCOPE.md`.