import { ContainerRegistrationKeys, Modules, ProductStatus } from "@medusajs/framework/utils"
import {
  createInventoryLevelsWorkflow,
  createProductsWorkflow,
  linkProductsToSalesChannelWorkflow,
  linkSalesChannelsToStockLocationWorkflow,
  updateInventoryLevelsWorkflow,
} from "@medusajs/medusa/core-flows"

export default async function seedE2EProduct({ container }: { container: any }) {
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const existing = await query.graph({
    entity: "product",
    fields: ["id", "handle", "variants.id"],
    filters: { handle: "e2e-sunlit-study" },
  })
  if (existing.data[0]) {
    const configuredKey = process.env.E2E_PUBLISHABLE_KEY
    if (!configuredKey) throw new Error("E2E_PUBLISHABLE_KEY is required")
    const keys = await query.graph({
      entity: "api_key",
      fields: ["sales_channels.id"],
      filters: { token: configuredKey, type: "publishable" },
    })
    const channelId = keys.data[0]?.sales_channels?.[0]?.id
    if (!channelId) throw new Error("The configured storefront key has no sales channel")
    const locations = await query.graph({
      entity: "stock_location",
      fields: ["id"],
      filters: { name: "Colourpalet Studio" },
    })
    if (!locations.data[0]) throw new Error("Colourpalet Studio stock location was not found")
    await linkProductsToSalesChannelWorkflow(container).run({
      input: { id: channelId, add: [existing.data[0].id] },
    })
    await linkSalesChannelsToStockLocationWorkflow(container).run({
      input: { id: locations.data[0].id, add: [channelId] },
    })
    const inventoryItemId = existing.data[0].variants?.[0]?.inventory_items?.[0]?.inventory_item_id
    if (!inventoryItemId) {
      const variants = await query.graph({
        entity: "product_variant",
        fields: ["inventory_items.inventory_item_id"],
        filters: { product_id: existing.data[0].id },
      })
      const resolvedInventoryItemId = variants.data[0]?.inventory_items?.[0]?.inventory_item_id
      if (!resolvedInventoryItemId) throw new Error("Audit product inventory item was not found")
      const levels = await query.graph({
        entity: "inventory_level",
        fields: ["id", "inventory_item_id", "location_id"],
        filters: { inventory_item_id: resolvedInventoryItemId },
      })
      if (!levels.data[0]) throw new Error("Audit product inventory level was not found")
      const reservations = await query.graph({
        entity: "reservation_item",
        fields: ["id"],
        filters: { inventory_item_id: resolvedInventoryItemId },
      })
      if (reservations.data.length) {
        const inventory = container.resolve(Modules.INVENTORY)
        await inventory.deleteReservationItems(reservations.data.map((item: { id: string }) => item.id))
      }
      await updateInventoryLevelsWorkflow(container).run({
        input: { updates: [{ ...levels.data[0], stocked_quantity: 1 }] },
      })
    }
    console.log(JSON.stringify({ product: existing.data[0] }))
    return
  }

  const [profiles, channels, locations] = await Promise.all([
    query.graph({ entity: "shipping_profile", fields: ["id"] }),
    query.graph({ entity: "sales_channel", fields: ["id"], filters: { name: "Colourpalet Storefront" } }),
    query.graph({ entity: "stock_location", fields: ["id"], filters: { name: "Colourpalet Studio" } }),
  ])
  const { result } = await createProductsWorkflow(container).run({
    input: { products: [{
      title: "Sunlit Courtyard Study",
      handle: "e2e-sunlit-study",
      description: "A one-of-one watercolour study prepared for checkout acceptance testing.",
      status: ProductStatus.PUBLISHED,
      thumbnail: "http://localhost:8000/images/home/category-paintings.png",
      images: [{ url: "http://localhost:8000/images/home/category-paintings.png" }],
      shipping_profile_id: profiles.data[0]!.id,
      sales_channels: [{ id: channels.data[0]!.id }],
      options: [{ title: "Edition", values: ["Original"] }],
      variants: [{
        title: "Original",
        sku: "E2E-SUNLIT-001",
        options: { Edition: "Original" },
        manage_inventory: true,
        prices: [{ currency_code: "inr", amount: 12500 }],
      }],
    }] },
  })
  const variants = await query.graph({
    entity: "product_variant",
    fields: ["id", "inventory_items.inventory_item_id"],
    filters: { product_id: result[0]!.id },
  })
  await createInventoryLevelsWorkflow(container).run({
    input: { inventory_levels: [{
      inventory_item_id: variants.data[0]!.inventory_items![0]!.inventory_item_id,
      location_id: locations.data[0]!.id,
      stocked_quantity: 1,
    }] },
  })
  console.log(JSON.stringify({ product: { id: result[0]!.id, handle: "e2e-sunlit-study" } }))
}
