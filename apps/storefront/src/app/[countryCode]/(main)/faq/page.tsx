import type { Metadata } from "next"
import EditorialPage from "@modules/content/components/editorial-page"
export const metadata: Metadata = { title: "Frequently Asked Questions | Colourpalet" }
export default function FaqPage() { return <EditorialPage eyebrow="A little clarity" title="Questions, answered." intro="A quick guide to originals, payment, delivery, and made-for-you artwork." sections={[
{ title: "Is each artwork original?", body: <p>Original pieces are sold in the quantity shown. A sold work remains in the gallery for reference but cannot be added to the cart.</p> },
{ title: "How do I pay?", body: <p>The MVP accepts Cash on Delivery only. Placing an order does not mean payment has been collected; payment is due on delivery.</p> },
{ title: "Can I request something similar?", body: <p>Yes. Use “Request similar artwork” or the custom artwork page. The source piece is inspiration only and is never silently added to your cart.</p> },
{ title: "How do commissions work?", body: <p>Send an enquiry first. The studio reviews feasibility, references, timing, and price with you before any work or order is confirmed.</p> },
{ title: "Can colours look different?", body: <p>Screens reproduce colour differently. Product photography aims to be faithful, but slight variation should be expected.</p> },
{ title: "Where can I see my orders?", body: <p>Create or sign in to your account, then open Orders. The confirmation page also shows the details immediately after checkout.</p> },
]} cta={{ label: "Browse available artworks", href: "/store" }} /> }