import type { Metadata } from "next"
import EditorialPage from "@modules/content/components/editorial-page"
export const metadata: Metadata = { title: "About the Artist | Colourpalet", description: "Meet the artist and discover the ideas, materials, and process behind Colourpalet." }
export default function AboutPage() { return <EditorialPage eyebrow="The artist & studio" title="A quiet practice built around colour, memory, and human stories." intro="Colourpalet is an independent art studio in India creating original work for lived-in spaces and personal commissions that hold meaning." sections={[
{ title: "The story", body: <p>The studio began with a simple belief: art should feel personal before it feels precious. Each work is approached as an object that will share everyday life with its collector.</p> },
{ title: "The process", body: <p>Ideas begin as loose studies, colour notes, and conversations. Layers are built slowly so marks, texture, and small imperfections remain part of the finished piece.</p> },
{ title: "Materials", body: <p>Every listing identifies its medium, dimensions, and surface. Original works are one of one; availability is always shown directly from studio inventory.</p> },
{ title: "Commissions", body: <p>Custom work starts with an enquiry—not an automatic purchase. The brief, timeline, price, references, and delivery expectations are agreed before work begins.</p> },
]} cta={{ label: "Start a custom artwork", href: "/custom-artwork" }} /> }