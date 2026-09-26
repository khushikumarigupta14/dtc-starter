import type { VendorProduct, VendorProductStatus } from "@lib/data/vendor-products"

const labels: Record<VendorProductStatus, string> = {
  pending: "Awaiting review",
  processing: "Publishing",
  approved: "Published",
  rejected: "Needs changes",
}

const badgeClasses: Record<VendorProductStatus, string> = {
  pending: "bg-[#efe4c5] text-[#705b1d]",
  processing: "bg-[#dfe8ec] text-[#355968]",
  approved: "bg-[#dfe9df] text-[#3d6245]",
  rejected: "bg-[#f2dddd] text-[#873e3e]",
}

const money = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 })

export default function VendorProductList({ products }: { products: VendorProduct[] }) {
  return (
    <section className="mt-12">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="editorial-kicker">Your catalogue</p>
          <h2 className="mt-3 font-display text-3xl leading-tight">Artwork submissions</h2>
        </div>
        <span className="text-sm text-[var(--color-muted)]">{products.length} total</span>
      </div>

      {products.length === 0 ? (
        <div className="paper-panel mt-6 px-6 py-12 text-center">
          <h3 className="font-display text-2xl">No artwork submitted yet</h3>
          <p className="mt-2 text-sm text-[var(--color-muted)]">Your first submission will appear here with its review status.</p>
        </div>
      ) : (
        <div className="mt-6 grid gap-4">
          {products.map((product) => (
            <article key={product.id} className="paper-panel grid gap-5 p-5 small:grid-cols-[96px_1fr_auto] small:items-center">
              <div className="aspect-square overflow-hidden bg-[#ece5da]">
                {product.image_url ? (
                  <img src={product.image_url} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-[var(--color-muted)]">No image</div>
                )}
              </div>
              <div>
                <h3 className="font-display text-2xl">{product.title}</h3>
                <p className="mt-1 text-sm text-[var(--color-muted)]">
                  {product.medium} · {product.dimensions} · {money.format(product.price)}
                </p>
                {product.review_note && <p className="mt-3 text-sm text-red-700">Admin note: {product.review_note}</p>}
              </div>
              <span className={"w-fit px-3 py-1 text-xs font-semibold " + badgeClasses[product.status]}>
                {labels[product.status]}
              </span>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
