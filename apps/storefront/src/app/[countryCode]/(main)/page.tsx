import { Metadata } from "next"

import FeaturedProducts from "@modules/home/components/featured-products"
import Hero from "@modules/home/components/hero"
import { listCollections } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Image from "next/image"

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
      <section className="border-b border-[var(--color-line)] bg-[var(--color-surface)]">
        <div className="content-container grid grid-cols-2 gap-y-8 py-8 text-sm small:grid-cols-4 small:py-10">
          {[
            ["Original works", "Authentic, one-of-a-kind art"],
            ["Pan India delivery", "Carefully packed for its journey"],
            ["Cash on Delivery", "Available on eligible orders"],
            ["Custom artwork", "Made around your story"],
          ].map(([title, copy]) => (
            <div key={title} className="border-l border-[var(--color-line)] pl-4 small:pl-6">
              <p className="font-semibold text-[var(--color-ink)]">{title}</p>
              <p className="mt-1 text-xs text-[var(--color-muted)]">{copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="content-container py-[var(--section-space)]">
        <div className="grid items-end gap-8 small:grid-cols-[0.75fr_1.25fr]">
          <div>
            <p className="editorial-kicker">Explore by category</p>
            <h2 className="section-title mt-4">Find art your way.</h2>
          </div>
          <p className="max-w-xl text-[var(--color-muted)] small:justify-self-end">
            Begin with the way a work feels—quiet lines, expressive colour, familiar places, or a piece made especially for you.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-2 gap-4 small:grid-cols-4 small:gap-6">
          {[
            ["Paintings", "Original works with colour and texture", "/store", "/images/home/category-paintings.png"],
            ["Drawings", "Pencil, charcoal and ink on paper", "/store", "/images/home/category-drawings.png"],
            ["Abstract", "Curated forms for thoughtful spaces", "/store", "/images/home/category-abstract.png"],
            ["Custom Art", "A personal work, created with you", "/custom-artwork", "/images/home/commission-landscape.png"],
          ].map(([title, copy, href, image], index) => (
            <LocalizedClientLink
              key={title}
              href={href}
              className="group block"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-[#e9e2d7]">
                <Image
                  src={image}
                  alt=""
                  fill
                  sizes="(max-width: 1023px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.025]"
                />
                <span className="absolute left-3 top-3 bg-[var(--color-surface)] px-2 py-1 text-[10px] text-[var(--color-accent)]">0{index + 1}</span>
              </div>
              <h3 className="mt-4 text-2xl group-hover:text-[var(--color-accent)]">{title}</h3>
              <p className="mt-2 max-w-[15rem] text-sm text-[var(--color-muted)]">{copy}</p>
            </LocalizedClientLink>
          ))}
        </div>
      </section>

      <section className="border-y border-[var(--color-line)] bg-[var(--color-surface)]">
        <div className="content-container grid gap-10 py-[var(--section-space)] small:grid-cols-2 small:items-center">
          <div className="relative aspect-[4/5] overflow-hidden">
            <Image
              src="/images/home/gallery-quiet-hero.png"
              alt="A curated original artwork in a considered interior"
              fill
              sizes="(max-width: 1023px) 100vw, 50vw"
              className="object-cover object-center"
            />
          </div>
          <div className="max-w-xl small:px-12">
            <p className="editorial-kicker">A curated perspective</p>
            <h2 className="section-title mt-5">Art for a more considered life.</h2>
            <p className="mt-7 text-[var(--color-muted)]">
              Each artwork is chosen for its craft, character and the story it brings to your space. Discover pieces that feel personal and enduring.
            </p>
            <LocalizedClientLink href="/store" className="theme-button-primary mt-9">Explore the collection</LocalizedClientLink>
          </div>
        </div>
      </section>

      <div className="bg-[var(--color-canvas)] py-8 small:py-12">
        <div className="content-container mb-2">
          <p className="editorial-kicker">Selected for you</p>
          <h2 className="section-title mt-4">Featured originals</h2>
        </div>
        <ul className="flex flex-col gap-x-6">
          <FeaturedProducts collections={collections} region={region} />
        </ul>
      </div>

      <section className="relative overflow-hidden border-t border-[var(--color-line)] bg-[var(--color-surface)]">
        <div className="absolute inset-0 bg-[url('/images/home/commission-landscape.png')] bg-cover bg-left opacity-40" aria-hidden="true" />
        <div className="content-container relative grid min-h-[430px] items-center py-20 small:grid-cols-2">
          <div className="hidden small:block" />
          <div className="max-w-xl bg-[var(--color-surface)]/90 p-8 backdrop-blur-sm small:p-12">
            <p className="editorial-kicker">Custom artwork</p>
            <h2 className="section-title mt-4">Have a vision in mind?</h2>
            <p className="mt-6 text-[var(--color-muted)]">Tell us about your space, memory or idea. We’ll shape it into a personal artwork enquiry together.</p>
            <LocalizedClientLink href="/custom-artwork" className="theme-button-secondary mt-8">Start a conversation</LocalizedClientLink>
          </div>
        </div>
      </section>
    </>
  )
}
