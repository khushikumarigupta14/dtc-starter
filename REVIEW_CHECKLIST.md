# Review Checklist

- Matches the request, scope, architecture, and business rules.
- Reuses Medusa capability and existing implementation.
- Preserves storefront/backend boundaries, validation, authorization, and secret safety.
- Keeps INR authoritative in Medusa and COD semantically distinct from collected payment.
- Preserves sold artwork while preventing purchase at zero inventory.
- Uses File Module abstraction for uploads.
- Handles relevant UI states and accessibility basics.
- Adds no prohibited service or unnecessary dependency.
- Typecheck/lint/tests/build pass as applicable; docs and assumptions are current.
