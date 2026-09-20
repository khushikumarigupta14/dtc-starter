# API Rules

- Use Medusa Store APIs/JS SDK from the storefront and Admin APIs from trusted admin contexts.
- Keep secrets and Admin credentials server-side; send the publishable key only where Medusa expects it.
- Use Medusa modules and workflows for writes; do not issue storefront SQL or bypass inventory/order/payment behavior.
- Validate custom API inputs explicitly and return useful public errors without internal diagnostics.
- Reuse existing data access helpers and preserve Medusa's resource/status models.
