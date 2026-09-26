import { HttpTypes } from "@medusajs/types"
import { listProducts } from "@lib/data/products"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ProductPreview from "@modules/products/components/product-preview"
import ProductRail from "@modules/home/components/featured-products/product-rail"

export default async function FeaturedProducts({
  collections,
  region,
}: {
  collections: HttpTypes.StoreCollection[]
  region: HttpTypes.StoreRegion
}) {
  if (!collections.length) {
    const {
      response: { products },
    } = await listProducts({
      regionId: region.id,
      queryParams: {
        limit: 4,
        fields: "*variants.calculated_price",
      },
    })

    if (!products.length) {
      return (
        <li className="content-container py-12">
          <div className="border-y border-[var(--color-line)] py-12 text-center">
            <h3 className="font-display text-3xl">New originals are being curated.</h3>
            <p className="mx-auto mt-3 max-w-lg text-sm text-[var(--color-muted)]">
              Visit the gallery to browse available artworks, or tell us about a custom piece you have in mind.
            </p>
            <LocalizedClientLink href="/store" className="theme-button-secondary mt-7">
              Browse the gallery
            </LocalizedClientLink>
          </div>
        </li>
      )
    }

    return (
      <li className="content-container py-12 small:py-16">
        <div className="mb-9 flex items-end justify-between gap-6 border-b border-[var(--color-line)] pb-4">
          <div>
            <p className="editorial-kicker mb-2">Fresh from the studio</p>
            <h3 className="font-display text-3xl small:text-4xl">Recently added</h3>
          </div>
          <LocalizedClientLink href="/store" className="text-sm underline underline-offset-4">
            View all
          </LocalizedClientLink>
        </div>
        <ul className="grid grid-cols-2 gap-x-4 gap-y-12 medium:grid-cols-4 medium:gap-x-6">
          {products.map((product) => (
            <li key={product.id}>
              <ProductPreview product={product} region={region} isFeatured />
            </li>
          ))}
        </ul>
      </li>
    )
  }

  return collections.map((collection) => (
    <li key={collection.id}>
      <ProductRail collection={collection} region={region} />
    </li>
  ))
}
