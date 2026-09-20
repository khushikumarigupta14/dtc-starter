# Project Management Guide

This document explains how Colourpalet is planned, operated, and changed. It complements the architecture and business-rule documents.

## Sources of truth

- `PROJECT_STATUS.md`: implemented flows, verified gaps, current validation, and next-task order.
- `SCOPE.md`: included and excluded product capabilities.
- `ROADMAP.md`: delivery phases and current completion notes.
- `ARCHITECTURE.md`: system boundaries and locked technology.
- `BUSINESS_RULES.md` and `API_RULES.md`: commerce behavior and API safety.
- `UI_GUIDELINES.md`: storefront experience and accessibility requirements.
- `TESTING.md` and `REVIEW_CHECKLIST.md`: verification and definition of done.

When documents disagree, an explicit approved task takes priority; update the affected document in the same change.

## How work moves

1. Write the outcome and acceptance criteria using `TASK_TEMPLATE.md`.
2. Place it in the relevant roadmap phase and note dependencies.
3. Inspect the current implementation and choose the existing Medusa primitive before adding custom behavior.
4. Make the smallest typed change across the correct boundary: storefront presentation, Store API/workflow, or Admin.
5. Test the narrow behavior first, then lint/build and integration checks in proportion to risk.
6. Review against `REVIEW_CHECKLIST.md`, update documentation, and record anything intentionally deferred.
7. Update `PROJECT_STATUS.md` and `ROADMAP.md` whenever implementation status or priorities change.

## Day-to-day ownership

- Artist/operator: catalog, images, INR pricing, inventory, orders, fulfilment, and customer records through Medusa Admin.
- Engineering: storefront, custom modules/workflows, validation, integrations, deployment, and technical documentation.
- Business owner: final copy, contact details, shipping/return promises, legal policies, tax, and production credentials.

## Content operations

Create and publish products in Medusa Admin, using the File Module for images. Original artwork normally has quantity `1`. When inventory reaches zero, keep the product published and let the storefront show it as sold. Never mark a COD order as paid merely because it was placed.

Custom artwork submissions are enquiries stored by the custom artwork module. Review them in Medusa Admin under **Custom artwork**, contact the requester, and agree price, timing, revisions, delivery, and rights before creating any commercial commitment. The current Admin page is read-only; status changes and internal notes must wait for an agreed operator workflow.

## Release checklist

- Confirm environment variables and secrets are set outside source control.
- Run `pnpm lint`, `pnpm build`, and applicable tests.
- Smoke-test home, gallery, artwork detail, sold state, cart, checkout, COD wording, confirmation, account, and custom request.
- Verify responsive layouts, keyboard focus, errors, empty/loading states, and meaningful image text.
- Review public contact details, service area, delivery promises, return policy, privacy policy, and terms with the business owner/legal adviser.
- Back up PostgreSQL and define rollback steps before a production release.

## Current status and remaining work

Implemented: monorepo foundation, Medusa/Admin, PostgreSQL, India/INR setup, local uploads, catalog/gallery, inventory-aware sold behavior, cart, COD checkout, order confirmation, accounts/orders, custom-art enquiry backend and form, plus core artist/information pages.

Before production, finalize brand copy and imagery, legal/business details, contact channels, shipping regions/rates/timelines, return and cancellation rules, tax configuration, production storage, deployment, backups, email notifications, observability, security review, and end-to-end acceptance testing. Online payments and other future items in `ROADMAP.md` remain outside MVP scope.