import type { Metadata } from "next"
import EditorialPage from "@modules/content/components/editorial-page"
export const metadata: Metadata = { title: "Contact | Colourpalet", description: "Contact Colourpalet about artworks, orders, or custom commissions." }
export default function ContactPage() { return <EditorialPage eyebrow="Get in touch" title="Let’s talk about art." intro="Choose the route that best matches your question so the studio has the context needed to help." sections={[
{ title: "Custom artwork", body: <p>Use the custom artwork form to share the subject, medium, size, timing, and inspiration. It creates an enquiry only; no order or payment is taken.</p> },
{ title: "An existing order", body: <p>Sign in to your account to find the order number and current details. Keep that number handy when contacting the studio.</p> },
{ title: "Artwork details", body: <p>Questions about a listed piece, framing, or display are welcome. Include the artwork title so the studio can respond accurately.</p> },
{ title: "Response time", body: <p>The studio aims to respond within two working days. Final public contact details must be configured by the owner before launch.</p> },
]} cta={{ label: "Send a custom-art enquiry", href: "/custom-artwork" }} /> }