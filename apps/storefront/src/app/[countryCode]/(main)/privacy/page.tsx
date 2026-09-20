import type { Metadata } from "next"
import EditorialPage from "@modules/content/components/editorial-page"
export const metadata: Metadata = { title: "Privacy Policy | Colourpalet" }
export default function PrivacyPage() { return <EditorialPage eyebrow="Last updated 20 September 2026" title="Privacy policy." intro="A plain-language summary of how Colourpalet handles customer information. Business identity, contact details, retention periods, and jurisdiction must be reviewed by the owner or legal adviser before launch." sections={[
{ title: "Information collected", body: <p>We collect details you provide for accounts, orders, delivery, customer support, and custom-art enquiries, plus essential technical information needed to operate and secure the store.</p> },
{ title: "How it is used", body: <p>Information is used to provide the store, fulfil orders, respond to enquiries, prevent misuse, maintain records, and meet applicable legal obligations.</p> },
{ title: "Sharing", body: <p>Information is shared only with service providers and authorities where needed to operate the store, deliver orders, secure the service, or comply with law. It is not sold.</p> },
{ title: "Your choices", body: <p>You may request access, correction, or deletion where applicable. Some order records may need to be retained for legal, accounting, fraud-prevention, or dispute purposes.</p> },
{ title: "Security & retention", body: <p>Reasonable safeguards and limited access should protect personal data. Records should be retained only as long as required for the stated purpose or by law.</p> },
{ title: "Contact & changes", body: <p>The final policy must name the data controller and a privacy contact. Material policy changes should be dated and communicated appropriately.</p> },
]} /> }