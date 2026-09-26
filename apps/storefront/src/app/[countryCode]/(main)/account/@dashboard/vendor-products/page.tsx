import { Metadata } from "next"
import { notFound } from "next/navigation"
import { retrieveCustomer } from "@lib/data/customer"
import { listVendorProducts } from "@lib/data/vendor-products"
import VendorProductForm from "@modules/vendor/components/vendor-product-form"
import VendorProductList from "@modules/vendor/components/vendor-product-list"

export const metadata: Metadata = {
  title: "Vendor studio",
  description: "Submit and manage your artwork for Colourpalet review.",
}

export default async function VendorProductsPage() {
  const customer = await retrieveCustomer().catch(() => null)
  if (!customer) notFound()

  const products = await listVendorProducts().catch(() => [])

  return (
    <div className="px-4 pb-16 small:px-0">
      <header className="mb-10 border-b border-[var(--color-line)] pb-8">
        <p className="editorial-kicker">Vendor studio</p>
        <h1 className="mt-3 font-display text-4xl leading-tight small:text-5xl">Share your work with Colourpalet</h1>
        <p className="mt-4 max-w-2xl text-[var(--color-muted)]">
          Add artwork details, price and inventory. The team reviews every submission before it appears in the gallery.
        </p>
      </header>
      <VendorProductForm />
      <VendorProductList products={products} />
    </div>
  )
}
