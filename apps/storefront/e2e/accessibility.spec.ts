import AxeBuilder from "@axe-core/playwright"
import { expect, test, type Page } from "@playwright/test"
import path from "node:path"

const auditDir = path.resolve(process.cwd(), ".codex-e2e", "accessibility")

async function expectNoCriticalViolations(page: Page) {
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze()
  const violations = results.violations.filter((item) =>
    ["critical", "serious"].includes(item.impact || "")
  )

  expect(violations, JSON.stringify(violations, null, 2)).toEqual([])
}

test("desktop home has critical semantics and no serious Axe violations", async ({ page }) => {
  await page.goto("/in")
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible()
  await page.screenshot({ path: path.join(auditDir, "01-desktop-home.png"), fullPage: true })

  await expect(page.getByRole("navigation")).toHaveCount(1)
  await expect(page.locator("footer")).toBeVisible()
  await expectNoCriticalViolations(page)
})

test("mobile menu supports keyboard focus and accessible navigation", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto("/in")
  await page.getByTestId("nav-menu-button").focus()
  await page.keyboard.press("Enter")

  const menu = page.getByTestId("nav-menu-popup")
  await expect(menu).toBeVisible()
  await page.screenshot({ path: path.join(auditDir, "02-mobile-menu.png"), fullPage: true })
  await expect(page.getByTestId("close-menu-button")).toBeFocused()
  await expectNoCriticalViolations(page)

  await page.keyboard.press("Escape")
  await expect(menu).toBeHidden()
  await expect(page.getByTestId("nav-menu-button")).toBeFocused()
})

test("custom request validation is perceivable and keeps focus on the error", async ({ page }) => {
  await page.goto("/in/custom-artwork")
  await page.getByRole("button", { name: "Send artwork request" }).click()
  await expect(page.getByLabel("Full name")).toBeFocused()
  await page.screenshot({ path: path.join(auditDir, "03-custom-request-validation.png"), fullPage: true })

  await expectNoCriticalViolations(page)
})
