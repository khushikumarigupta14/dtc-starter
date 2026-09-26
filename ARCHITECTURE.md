# Architecture

```text
Next.js Storefront
  customer + vendor dashboard
        ↓ authenticated Store API / Medusa JS SDK
Medusa Backend + Medusa Admin
  vendor submission module + operator approval
        ↓ Medusa modules
PostgreSQL (local)
```

Medusa is the source of truth for catalog, INR pricing, inventory, carts, customers, orders, fulfillment, and payment state. The custom vendor-submission module stores private submissions tied to the authenticated customer ID. Only the authenticated Admin approval route converts a pending submission into a published Medusa product with price and inventory. Admin handles standard artist operations. Build an Admin extension only for a required capability Admin does not expose.

MVP payment is COD through `pp_system_default`. Development uploads use the default Medusa Local File Provider. Neither choice may leak infrastructure-specific logic into product or storefront code.
