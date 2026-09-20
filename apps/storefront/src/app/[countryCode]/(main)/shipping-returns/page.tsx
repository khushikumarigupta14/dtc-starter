import type { Metadata } from "next"
import EditorialPage from "@modules/content/components/editorial-page"
export const metadata: Metadata = { title: "Shipping & Returns | Colourpalet" }
export default function ShippingReturnsPage() { return <EditorialPage eyebrow="Collector care" title="Shipping, delivery & returns." intro="This page explains the intended customer experience. The owner must add final service areas, timelines, charges, and return windows before public launch." sections={[
{ title: "Shipping", body: <p>Available methods and charges are calculated in checkout from the delivery address. Orders are prepared with artwork-safe protective packaging.</p> },
{ title: "Cash on Delivery", body: <p>Payment is due when the order is delivered. An order confirmation records the order; it is not proof that payment has already been collected.</p> },
{ title: "Delivery checks", body: <p>Inspect the outer package on arrival. Photograph visible damage before opening and keep all packaging while the studio reviews the issue.</p> },
{ title: "Returns & damage", body: <p>Final eligibility, reporting windows, and return instructions must be confirmed in the production policy. Custom-made work may require different terms where permitted by law.</p> },
]} /> }