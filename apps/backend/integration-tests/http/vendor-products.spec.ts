import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { addToCartWorkflow, createCartWorkflow } from "@medusajs/medusa/core-flows"
import initialDataSeed from "../../src/migration-scripts/initial-data-seed"
import { GET as listVendorProducts } from "../../src/api/store/vendor-products/route"
import { POST as approveVendorProduct } from "../../src/api/admin/vendor-products/[id]/approve/route"
import { VENDOR_PRODUCT_SUBMISSION_MODULE } from "../../src/modules/vendor-product-submission"
import type VendorProductSubmissionModuleService from "../../src/modules/vendor-product-submission/service"
import { createVendorProductSubmissionWorkflow } from "../../src/workflows/create-vendor-product-submission"

jest.setTimeout(180_000)

function response() {
  const res = { status: jest.fn(), json: jest.fn() }
  res.status.mockReturnValue(res)
  return res
}

medusaIntegrationTestRunner({
  moduleName: "colourpalet-vendor-products",
  inApp: true,
  testSuite: ({ getContainer }) => {
    beforeEach(async () => {
      await initialDataSeed({ container: getContainer() })
    })

    it("returns only submissions owned by the authenticated customer", async () => {
      const container = getContainer()
      await createVendorProductSubmissionWorkflow(container).run({
        input: {
          vendor_customer_id: "cus_owner",
          vendor_name: "Owner Artist",
          vendor_email: "owner@example.com",
          title: "Owner Landscape",
          description: "A detailed landscape belonging to the authenticated vendor.",
          medium: "Watercolour",
          dimensions: "30 x 40 cm",
          price: 12500,
          quantity: 1,
          image_url: null,
        },
      })
      await createVendorProductSubmissionWorkflow(container).run({
        input: {
          vendor_customer_id: "cus_other",
          vendor_name: "Other Artist",
          vendor_email: "other@example.com",
          title: "Other Landscape",
          description: "A detailed landscape belonging to a different vendor account.",
          medium: "Oil",
          dimensions: "50 x 60 cm",
          price: 22000,
          quantity: 1,
          image_url: null,
        },
      })

      const res = response()
      await listVendorProducts({
        auth_context: { actor_id: "cus_owner" },
        scope: container,
      } as never, res as never)

      expect(res.json).toHaveBeenCalledWith({
        vendor_products: [expect.objectContaining({
          vendor_customer_id: "cus_owner",
          title: "Owner Landscape",
        })],
        count: 1,
      })
    })

    it("publishes an approved submission with its INR price and stock", async () => {
      const container = getContainer()
      const { result: submission } = await createVendorProductSubmissionWorkflow(container).run({
        input: {
          vendor_customer_id: "cus_owner",
          vendor_name: "Owner Artist",
          vendor_email: "owner@example.com",
          title: "Monsoon Light",
          description: "An original monsoon landscape prepared for catalog publication.",
          medium: "Watercolour on paper",
          dimensions: "30 x 40 cm",
          price: 18500,
          quantity: 2,
          image_url: "http://localhost:9000/static/monsoon-light.webp",
        },
      })
      const res = response()

      await approveVendorProduct({
        params: { id: submission.id },
        scope: container,
      } as never, res as never)

      const payload = res.json.mock.calls[0][0]
      expect(payload.vendor_product).toEqual(expect.objectContaining({
        id: submission.id,
        status: "approved",
        product_id: payload.product.id,
      }))
      expect(payload.product).toEqual(expect.objectContaining({
        title: "Monsoon Light",
        status: "published",
        thumbnail: "http://localhost:9000/static/monsoon-light.webp",
      }))

      const query = container.resolve(ContainerRegistrationKeys.QUERY)
      const { data } = await query.graph({
        entity: "product",
        fields: [
          "id",
          "status",
          "metadata",
          "sales_channels.name",
          "variants.prices.amount",
          "variants.prices.currency_code",
          "variants.inventory_items.inventory_item_id",
        ],
        filters: { id: payload.product.id },
      })
      const products = data as unknown as Array<{
        id: string
        status: string
        metadata: Record<string, unknown>
        sales_channels: Array<{ name: string }>
        variants: Array<{
          prices: Array<{ amount: number; currency_code: string }>
          inventory_items: Array<{ inventory_item_id: string }>
        }>
      }>
      expect(products).toHaveLength(1)
      expect(products[0]).toEqual(expect.objectContaining({
        status: "published",
        metadata: expect.objectContaining({
          vendor_submission_id: submission.id,
          vendor_customer_id: "cus_owner",
        }),
        sales_channels: [expect.objectContaining({ name: "Colourpalet Storefront" })],
      }))
      expect(products[0].variants[0].prices).toContainEqual(expect.objectContaining({
        amount: 18500,
        currency_code: "inr",
      }))

      const inventoryItemId = products[0]!.variants[0]!.inventory_items[0]!.inventory_item_id
      const { data: levels } = await query.graph({
        entity: "inventory_level",
        fields: ["stocked_quantity", "location_id"],
        filters: { inventory_item_id: inventoryItemId },
      })
      const { data: locations } = await query.graph({
        entity: "stock_location",
        fields: ["id"],
        filters: { name: "Colourpalet Studio" },
      })
      expect(levels).toContainEqual(expect.objectContaining({
        stocked_quantity: 2,
        location_id: locations[0]!.id,
      }))

      const service = container.resolve<VendorProductSubmissionModuleService>(
        VENDOR_PRODUCT_SUBMISSION_MODULE
      )
      await expect(service.retrieveVendorProductSubmission(submission.id)).resolves.toEqual(
        expect.objectContaining({ status: "approved", product_id: payload.product.id })
      )
    })

  },
})
