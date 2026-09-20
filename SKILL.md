# Colourpalet Commerce Implementation Workflow

Classify each task as storefront, catalog, inventory, cart, checkout/COD, order, customer, custom request, upload, admin, configuration, bug fix, test, or documentation. Inspect existing routes, modules, data utilities, shared components, and tests before creating code.

Choose Medusa platform capabilities first. Storefront owns presentation and customer interaction; backend owns commerce rules, validation, workflows, secrets, and PostgreSQL persistence. Storage uses the File Module abstraction and MVP payment uses only the system provider.

Keep changes typed, small, reusable, explicit, and free of secrets. Consider loading, success, empty, sold/unavailable, validation, server error, retry, responsive layout, keyboard use, and accessibility. Run narrow checks before broader lint, test, typecheck, or build checks.

Inventory above zero is purchasable; zero is sold/unavailable, not a reason to delete a product. Show `pp_system` as “Cash on Delivery”; do not claim cash was collected when an order is created. Storefront code must never write directly to local storage paths.
