import { expect, test } from "@playwright/test"

const studioLinks = [
  { name: "Shop artworks", path: "/in/store" },
  { name: "Custom artwork", path: "/in/custom-artwork" },
  { name: "About the artist", path: "/in/about" },
  { name: "Contact", path: "/in/contact" },
  { name: "FAQ", path: "/in/faq" },
  { name: "Shipping & returns", path: "/in/shipping-returns" },
  { name: "Privacy", path: "/in/privacy" },
  { name: "Terms", path: "/in/terms" },
] as const

test.describe("localized footer navigation", () => {
  for (const link of studioLinks) {
    test(`${link.name} preserves the country route`, async ({ page }) => {
      await page.goto("/in")

      const footerLink = page.locator("footer").getByRole("link", {
        name: link.name,
        exact: true,
      })

      await expect(footerLink).toHaveAttribute("href", link.path)
      await footerLink.click()
      await expect(page).toHaveURL(new RegExp(`${link.path.replace("/", "\\/")}/?$`))
    })
  }
})
