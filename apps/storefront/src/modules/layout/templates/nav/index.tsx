import { Suspense } from "react"

import { listLocales } from "@lib/data/locales"
import { getLocale } from "@lib/data/locale-actions"
import { listRegions } from "@lib/data/regions"
import { StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import SideMenu from "@modules/layout/components/side-menu"

export default async function Nav() {
  const [regions, locales, currentLocale] = await Promise.all([
    listRegions().then((regions: StoreRegion[]) => regions),
    listLocales(),
    getLocale(),
  ])

  return (
    <div className="sticky top-0 inset-x-0 z-50 group">
      <div className="hidden h-7 items-center justify-between bg-[var(--color-olive)] px-[var(--page-gutter)] text-[9px] font-semibold uppercase tracking-[0.18em] text-white small:flex">
        <span>Original artworks · Secure packaging · Pan India shipping</span>
        <span>Custom artwork enquiries welcome</span>
      </div>
      <header className="relative h-[74px] mx-auto border-b border-[var(--color-line)] bg-[var(--color-surface)]/95 backdrop-blur-xl duration-200">
        <nav className="content-container flex items-center justify-between w-full h-full text-sm">
          <div className="h-full flex items-center small:hidden">
            <div className="h-full">
              <SideMenu regions={regions} locales={locales} currentLocale={currentLocale} />
            </div>
          </div>

          <div className="flex items-center h-full small:order-first small:mr-12">
            <LocalizedClientLink
              href="/"
              className="font-display text-2xl tracking-[-0.035em] text-[var(--color-ink)] hover:text-[var(--color-accent)] small:text-[30px]"
              data-testid="nav-store-link"
            >
              Colourpalet
            </LocalizedClientLink>
          </div>

          <div className="flex items-center gap-x-6 h-full flex-1 justify-end">
            <div className="hidden small:flex items-center gap-x-7 h-full mr-auto">
              <LocalizedClientLink className="hover:text-[var(--color-accent)]" href="/store">Shop</LocalizedClientLink>
              <LocalizedClientLink className="hover:text-[var(--color-accent)]" href="/store">Collections</LocalizedClientLink>
              <LocalizedClientLink className="hover:text-[var(--color-accent)]" href="/about">About the Artist</LocalizedClientLink>
              <LocalizedClientLink className="hover:text-[var(--color-accent)]" href="/custom-artwork">Custom Artwork</LocalizedClientLink>
              <LocalizedClientLink
                className="hover:text-[var(--color-accent)]"
                href="/account"
                data-testid="nav-account-link"
              >
                Account
              </LocalizedClientLink>
            </div>
            <Suspense
              fallback={
                <LocalizedClientLink
                  className="hover:text-ui-fg-base flex gap-2"
                  href="/cart"
                  data-testid="nav-cart-link"
                >
                  Cart (0)
                </LocalizedClientLink>
              }
            >
              <CartButton />
            </Suspense>
          </div>
        </nav>
      </header>
    </div>
  )
}
