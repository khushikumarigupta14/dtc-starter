import { expect, test } from "@playwright/test"

test.describe("mobile navigation", () => {
  test.use({ viewport: { width: 390, height: 844 } })

  test("menu exposes localized destinations and navigates", async ({ page }) => {
    await page.goto("/in")
    await page.getByTestId("nav-menu-button").click()

    const menu = page.getByTestId("nav-menu-popup")
    await expect(menu).toBeVisible()
    await expect(menu.getByRole("link", { name: "Home", exact: true })).toHaveAttribute("href", "/in")
    await expect(menu.getByRole("link", { name: "Artworks", exact: true })).toHaveAttribute("href", "/in/store")
    await expect(menu.getByRole("link", { name: "Custom art", exact: true })).toHaveAttribute("href", "/in/custom-artwork")
    await expect(menu.getByRole("link", { name: "Account", exact: true })).toHaveAttribute("href", "/in/account")
    await expect(menu.getByRole("link", { name: "Cart", exact: true })).toHaveAttribute("href", "/in/cart")

    await menu.getByRole("link", { name: "Artworks", exact: true }).click()
    await expect(page).toHaveURL(/\/in\/store\/?$/)
  })

  test("menu can be dismissed without navigation", async ({ page }) => {
    await page.goto("/in")
    await page.getByTestId("nav-menu-button").click()
    await expect(page.getByTestId("nav-menu-popup")).toBeVisible()
    await page.getByTestId("close-menu-button").click()
    await expect(page.getByTestId("nav-menu-popup")).toBeHidden()
    await expect(page).toHaveURL(/\/in\/?$/)
  })
})

test.describe("storefront failure and empty states", () => {
  test("empty cart guides the guest back to localized products", async ({ page }) => {
    await page.goto("/in/cart")
    await expect(page.getByTestId("empty-cart-message")).toBeVisible()

    const explore = page.getByRole("link", { name: "Explore products", exact: true })
    await expect(explore).toHaveAttribute("href", "/in/store")
    await explore.click()
    await expect(page).toHaveURL(/\/in\/store\/?$/)
  })

  test("custom request prevents incomplete and too-short submissions", async ({ page }) => {
    await page.goto("/in/custom-artwork")
    await page.getByRole("button", { name: "Send artwork request" }).click()

    const fullName = page.getByLabel("Full name")
    await expect(fullName).toBeFocused()
    expect(await fullName.evaluate((input: HTMLInputElement) => input.validity.valueMissing)).toBe(true)

    await fullName.fill("Test Customer")
    await page.getByLabel("Email").fill("customer@example.com")
    await page.getByLabel("Artwork type").selectOption({ label: "Painting" })
    const instructions = page.getByLabel("Tell us about the artwork")
    await instructions.fill("Too short")
    await page.getByRole("button", { name: "Send artwork request" }).click()

    await expect(instructions).toBeFocused()
    expect(await instructions.evaluate((input: HTMLTextAreaElement) => input.validity.tooShort)).toBe(true)
    await expect(page.getByRole("heading", { name: "Request received" })).toHaveCount(0)
  })
})
