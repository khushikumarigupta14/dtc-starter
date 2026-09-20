import type { Metadata } from "next"
import CustomArtworkRequestForm from "@modules/custom-artwork/components/request-form"

export const metadata: Metadata = {
  title: "Custom Artwork Request | Colourpalet",
  description: "Request a made-for-you portrait, painting, or drawing from the Colourpalet studio.",
}

export default async function CustomArtworkPage({ searchParams }: { searchParams: Promise<{ inspired_by?: string }> }) {
  const { inspired_by: inspiredBy } = await searchParams
  return (
    <main className="content-container py-12 small:py-20">
      <div className="mx-auto grid max-w-5xl gap-10 small:grid-cols-[0.8fr_1.2fr]">
        <section>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-800">Made for you</p>
          <h1 className="mt-3 text-4xl leading-tight text-stone-900">Commission a meaningful piece of art</h1>
          <p className="mt-5 leading-7 text-ui-fg-subtle">Share your idea with our studio. We will review the brief, discuss references and timing, and send a quote before work begins.</p>
          {inspiredBy && <p className="mt-5 rounded-md bg-amber-50 p-4 text-sm text-amber-950">Your request will be linked to the artwork that inspired you.</p>}
        </section>
        <section className="rounded-xl border border-ui-border-base bg-stone-50 p-6 small:p-8">
          <CustomArtworkRequestForm inspiredBy={inspiredBy} />
        </section>
      </div>
    </main>
  )
}
