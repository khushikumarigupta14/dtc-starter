# AGENTS.md

## Mission

Build and maintain Colourpalet without changing its agreed architecture or business behavior.

## Read Before Coding

Read `README.md`, `SCOPE.md`, `ARCHITECTURE.md`, `BUSINESS_RULES.md`, `API_RULES.md`, `UI_GUIDELINES.md`, `TESTING.md`, and `REVIEW_CHECKLIST.md` before editing. Follow an explicit task when it clearly overrides a documented rule and update the relevant documentation.

## Locked MVP Technology

Use Next.js, TypeScript, Medusa, Medusa Admin, PostgreSQL, Cash on Delivery through `pp_system`, and Medusa Local File Provider during development.

Do not add MongoDB, Razorpay, Stripe, PayPal, Cloudinary, AWS S3, Firebase, Supabase, or another ecommerce platform unless explicitly requested.

## Engineering Rules

1. Prefer Medusa modules, workflows, APIs, and Admin capabilities over custom systems.
2. Keep storefront presentation separate from backend business rules; never access PostgreSQL from the storefront.
3. Validate state-changing operations server-side and never expose secrets.
4. Preserve type safety; avoid duplicate logic and speculative abstractions.
5. Do not edit generated/vendor code or install unnecessary dependencies.
6. Product availability must reflect backend inventory.
7. Never delete or unpublish sold artwork merely because inventory is zero.
8. COD order creation does not mean payment was collected.
9. Use Medusa's file abstraction, never hard-coded filesystem paths.
10. Handle relevant loading, empty, unavailable, validation, and failure states.

## Workflow and Definition of Done

Find the existing implementation, identify the relevant Medusa primitive, make the smallest coherent typed change, add or update tests, run relevant validation, and review against `REVIEW_CHECKLIST.md`. Report changed files, behavior, checks, exclusions, and assumptions.
