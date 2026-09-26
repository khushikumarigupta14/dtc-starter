import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { updateInventoryLevelsWorkflow } from "@medusajs/medusa/core-flows"
import initialDataSeed from "../../src/migration-scripts/initial-data-seed"
import { POST as createCustomRequest } from "../../src/api/store/custom-artwork-requests/route"
import { POST as approveVendorProduct } from "../../src/api/admin/vendor-products/[id]/approve/route"
import { CUSTOM_ARTWORK_REQUEST_MODULE } from "../../src/modules/custom-artwork-request"
import type CustomArtworkRequestModuleService from "../../src/modules/custom-artwork-request/service"
import { createVendorProductSubmissionWorkflow } from "../../src/workflows/create-vendor-product-submission"

jest.setTimeout(180_000)

function response() {
  const res = { status: jest.fn(), json: jest.fn() }
  res.status.mockReturnValue(res)
  return res
}

medusaIntegrationTestRunner({
  moduleName: "colourpalet-custom-and-sold",
  inApp: true,
  testSuite: ({ api, getContainer }) => {
    beforeEach(async () => initialDataSeed({ container: getContainer() }))

    it("persists a validated custom artwork enquiry with its source artwork", async () => {
      const container = getContainer()
      const res = response()
      await createCustomRequest({
        scope: container,
        body: {
          full_name: "  Anika Sharma  ",
          email: "anika@example.com",
          phone: "",
          artwork_type: " Family Portrait ",
          preferred_medium: "Watercolour",
          size: "30 x 40 cm",
          orientation: "Portrait",
          required_date: "2026-12-20",
          instructions: "Please create a warm portrait with a quiet neutral background.",
          inspired_by_product_id: "prod_inspiration",
        },
      } as never, res as never)

      expect(res.status).toHaveBeenCalledWith(201)
      const created = res.json.mock.calls[0][0].custom_artwork_request
      const service = container.resolve<CustomArtworkRequestModuleService>(CUSTOM_ARTWORK_REQUEST_MODULE)
      await expect(service.retrieveCustomArtworkRequest(created.id)).resolves.toEqual(
        expect.objectContaining({
          full_name: "Anika Sharma",
          email: "anika@example.com",
          phone: null,
          artwork_type: "Family Portrait",
          inspired_by_product_id: "prod_inspiration",
          instructions: "Please create a warm portrait with a quiet neutral background.",
        })
      )
    })

    it("keeps a published artwork visible through the Store API at zero inventory", async () => {
      const container = getContainer()
      const query = container.resolve(ContainerRegistrationKeys.QUERY)
      const { result: submission } = await createVendorProductSubmissionWorkflow(container).run({
        input: {
          vendor_customer_id: "cus_sold", vendor_name: "Sold Artist", vendor_email: "sold@example.com",
          title: "Sold Original", description: "An original retained in the gallery after its inventory reaches zero.",
          medium: "Graphite", dimensions: "21 x 30 cm", price: 11000, quantity: 1, image_url: null,
        },
      })
      const approvalResponse = response()
      await approveVendorProduct({ params: { id: submission.id }, scope: container } as never, approvalResponse as never)
      const productId = approvalResponse.json.mock.calls[0][0].product.id
      const { data: products } = await query.graph({
        entity: "product",
        fields: ["id", "status", "sales_channels.id", "variants.inventory_items.inventory_item_id"],
        filters: { id: productId },
      })
      const inventoryItemId = products[0]!.variants[0]!.inventory_items![0]!.inventory_item_id
      const { data: levels } = await query.graph({
        entity: "inventory_level",
        fields: ["id", "inventory_item_id", "location_id"],
        filters: { inventory_item_id: inventoryItemId },
      })
      await updateInventoryLevelsWorkflow(container).run({
        input: { updates: [{ ...levels[0]!, stocked_quantity: 0 }] },
      })
      const { data: keys } = await query.graph({
        entity: "api_key", fields: ["token", "sales_channels.id"], filters: { type: "publishable" },
      })
      const storefrontChannelId = products[0]!.sales_channels?.[0]?.id
      const storefrontKey = keys.find((key) =>
        key.sales_channels?.some((channel) => channel?.id === storefrontChannelId)
      )
      expect(storefrontKey).toBeDefined()
      const storeResponse = await api.get(
        `/store/products/${productId}?fields=id,title,*variants,+variants.inventory_quantity`,
        { headers: { "x-publishable-api-key": storefrontKey!.token } }
      )

      expect(products[0]!.status).toBe("published")
      expect(storeResponse.status).toBe(200)
      expect(storeResponse.data.product).toEqual(expect.objectContaining({ id: productId, title: "Sold Original" }))
      expect(storeResponse.data.product.variants[0].inventory_quantity).toBe(0)
    })
  },
})
