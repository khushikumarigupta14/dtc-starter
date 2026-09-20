import { Metadata } from "next"

import FeaturedProducts from "@modules/home/components/featured-products"
import Hero from "@modules/home/components/hero"
import { listCollections } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"

export const metadata: Metadata = {
  title: "Colourpalet | Original Art & Custom Portraits",
  description: "Discover original paintings and drawings, or commission a custom artwork made for you.",
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params

  const { countryCode } = params

  const region = await getRegion(countryCode)

  const { collections } = await listCollections({
    fields: "id, handle, title",
  })

  if (!collections || !region) {
    return null
  }

  return (
    <>
      <Hero />
      <div className="py-16 bg-stone-50">
        <div className="content-container mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-800">Curated originals</p>
          <h2 className="mt-3 text-3xl text-stone-900">Explore the collection</h2>
        </div>
        <ul className="flex flex-col gap-x-6">
          <FeaturedProducts collections={collections} region={region} />
        </ul>
      </div>
    </>
  )
}
