# API Rules

- Use Medusa Store APIs/JS SDK from the storefront and Admin APIs from trusted admin contexts.
- Keep secrets and Admin credentials server-side; send the publishable key only where Medusa expects it.
- Use Medusa modules and workflows for writes; do not issue storefront SQL or bypass inventory/order/payment behavior.
- Validate custom API inputs explicitly and return useful public errors without internal diagnostics.
- Reuse existing data access helpers and preserve Medusa's resource/status models.
- Require customer authentication on vendor Store API routes, scope reads to the authenticated customer ID, and never accept a vendor/customer owner ID from the request body.
- Require Admin authentication for review actions. Product creation must occur only in the approval handler and remain idempotent for already-reviewed submissions.
