import type { Metadata } from "next"
import EditorialPage from "@modules/content/components/editorial-page"
export const metadata: Metadata = { title: "Terms & Conditions | Colourpalet" }
export default function TermsPage() { return <EditorialPage eyebrow="Last updated 20 September 2026" title="Terms & conditions." intro="These draft storefront terms describe the intended service. The business identity, address, jurisdiction, cancellation rights, and production policies require legal review before launch." sections={[
{ title: "Store use", body: <p>Use the store lawfully and provide accurate account, contact, and delivery information. Availability, pricing, and order acceptance are subject to the information shown during checkout.</p> },
{ title: "Original artworks", body: <p>Originals are limited by inventory. A sold artwork may remain visible as part of the artist’s portfolio but cannot be purchased when unavailable.</p> },
{ title: "Orders & payment", body: <p>Orders use Cash on Delivery in the MVP. Order creation is not payment collection. The studio may contact you to verify details before fulfilment.</p> },
{ title: "Custom requests", body: <p>A custom-art form submission is an enquiry, not an order or accepted quote. Scope, price, schedule, revisions, rights, and cancellation terms must be agreed separately.</p> },
{ title: "Images & intellectual property", body: <p>Artwork and site content remain protected by applicable intellectual-property rights. Buying an artwork does not transfer copyright or reproduction rights unless agreed in writing.</p> },
{ title: "Liability & governing terms", body: <p>Nothing here excludes rights or remedies that cannot lawfully be excluded. Final limits, dispute process, governing law, and business details require professional review.</p> },
]} /> }