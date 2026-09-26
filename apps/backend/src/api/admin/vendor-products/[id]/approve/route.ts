import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys, MedusaError } from "@medusajs/framework/utils"
import {
  createInventoryLevelsWorkflow,
  createProductsWorkflow,
  deleteProductsWorkflow,
} from "@medusajs/medusa/core-flows"
import { VENDOR_PRODUCT_SUBMISSION_MODULE } from "../../../../../modules/vendor-product-submission"
import type VendorProductSubmissionModuleService from "../../../../../modules/vendor-product-submission/service"
import { updateVendorProductSubmissionWorkflow } from "../../../../../workflows/update-vendor-product-submission"

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const service = req.scope.resolve<VendorProductSubmissionModuleService>(VENDOR_PRODUCT_SUBMISSION_MODULE)
  const submission = await service.retrieveVendorProductSubmission(req.params.id)
  if (submission.status !== "pending") {
    throw new MedusaError(MedusaError.Types.NOT_ALLOWED, "Only pending submissions can be approved")
  }

  await updateVendorProductSubmissionWorkflow(req.scope).run({
    input: { id: submission.id, status: "processing" },
  })

  let createdProductId: string | null = null

  try {
    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
    const [{ data: profiles }, { data: channels }, { data: locations }] = await Promise.all([
      query.graph({ entity: "shipping_profile", fields: ["id"] }),
      query.graph({ entity: "sales_channel", fields: ["id"], filters: { name: "Colourpalet Storefront" } }),
      query.graph({ entity: "stock_location", fields: ["id"], filters: { name: "Colourpalet Studio" } }),
    ])
    if (!profiles[0] || !channels[0] || !locations[0]) {
      throw new MedusaError(MedusaError.Types.NOT_FOUND, "Store foundation data is missing; run the backend seed")
    }

    const images = submission.image_url ? [{ url: submission.image_url }] : []
    const { result: products } = await createProductsWorkflow(req.scope).run({
      input: {
        products: [{
          title: submission.title,
          description: submission.description,
          status: "published",
          thumbnail: submission.image_url,
          images,
          shipping_profile_id: profiles[0].id,
          sales_channels: [{ id: channels[0].id }],
          metadata: {
            vendor_submission_id: submission.id,
            vendor_customer_id: submission.vendor_customer_id,
            vendor_name: submission.vendor_name,
            medium: submission.medium,
            dimensions: submission.dimensions,
          },
          options: [{ title: "Edition", values: ["Original"] }],
          variants: [{
            title: "Original",
            options: { Edition: "Original" },
            manage_inventory: true,
            prices: [{ currency_code: "inr", amount: submission.price }],
          }],
        }],
      },
    })
    const product = products[0]
    createdProductId = product.id
    const { data: variants } = await query.graph({
      entity: "product_variant",
      fields: ["id", "inventory_items.inventory_item_id"],
      filters: { product_id: product.id },
    })
    const inventoryItemId = variants[0]?.inventory_items?.[0]?.inventory_item_id
    if (!inventoryItemId) {
      throw new MedusaError(MedusaError.Types.NOT_FOUND, "Created product inventory item was not found")
    }
    await createInventoryLevelsWorkflow(req.scope).run({
      input: {
        inventory_levels: [{
          inventory_item_id: inventoryItemId,
          location_id: locations[0].id,
          stocked_quantity: submission.quantity,
        }],
      },
    })
    const { result: approved } = await updateVendorProductSubmissionWorkflow(req.scope).run({
      input: {
        id: submission.id,
        status: "approved",
        product_id: product.id,
        review_note: null,
      },
    })
    res.json({ vendor_product: approved, product })
  } catch (error) {
    if (createdProductId) {
      await deleteProductsWorkflow(req.scope).run({
        input: { ids: [createdProductId] },
      }).catch(() => undefined)
    }
    await updateVendorProductSubmissionWorkflow(req.scope).run({
      input: { id: submission.id, status: "pending" },
    })
    throw error
  }
}
