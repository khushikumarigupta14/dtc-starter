import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { addShippingMethodToCartWorkflow, addToCartWorkflow, completeCartWorkflow, createCartWorkflow, createPaymentCollectionForCartWorkflow, updateCartWorkflow } from "@medusajs/medusa/core-flows"
import initialDataSeed from "../../src/migration-scripts/initial-data-seed"
import { POST as approveVendorProduct } from "../../src/api/admin/vendor-products/[id]/approve/route"
import { createVendorProductSubmissionWorkflow } from "../../src/workflows/create-vendor-product-submission"

jest.setTimeout(180_000)
const response = () => ({ json: jest.fn() })

medusaIntegrationTestRunner({
  moduleName: "colourpalet-cod-checkout",
  inApp: true,
  testSuite: ({ api, getContainer }) => {
    beforeEach(async () => initialDataSeed({ container: getContainer() }))

    it("creates a COD order without recording collected payment", async () => {
      const container = getContainer()
      const query = container.resolve(ContainerRegistrationKeys.QUERY)
      const { result: submission } = await createVendorProductSubmissionWorkflow(container).run({
        input: {
          vendor_customer_id: "cus_cod", vendor_name: "COD Artist", vendor_email: "artist@example.com",
          title: "COD Original", description: "An original artwork used to verify cash-on-delivery order semantics.",
          medium: "Watercolour", dimensions: "30 x 40 cm", price: 15000, quantity: 1, image_url: null,
        },
      })
      const approvalResponse = response()
      await approveVendorProduct({ params: { id: submission.id }, scope: container } as never, approvalResponse as never)
      const productId = approvalResponse.json.mock.calls[0][0].product.id
      const [products, regions, channels, shippingOptions, apiKeys] = await Promise.all([
        query.graph({ entity: "product", fields: ["variants.id"], filters: { id: productId } }),
        query.graph({ entity: "region", fields: ["id"], filters: { name: "India" } }),
        query.graph({ entity: "sales_channel", fields: ["id"], filters: { name: "Colourpalet Storefront" } }),
        query.graph({ entity: "shipping_option", fields: ["id"], filters: { name: "Standard Delivery" } }),
        query.graph({ entity: "api_key", fields: ["token"], filters: { type: "publishable" } }),
      ])
      const { result: cart } = await createCartWorkflow(container).run({
        input: { region_id: regions.data[0]!.id, sales_channel_id: channels.data[0]!.id, email: "customer@example.com" },
      })
      const address = { first_name: "Test", last_name: "Customer", address_1: "1 Studio Road", city: "Mumbai", country_code: "in", postal_code: "400001" }
      await updateCartWorkflow(container).run({ input: { id: cart.id, shipping_address: address, billing_address: address } })
      await addToCartWorkflow(container).run({ input: { cart_id: cart.id, items: [{ variant_id: products.data[0]!.variants[0]!.id, quantity: 1 }] } })
      await addShippingMethodToCartWorkflow(container).run({ input: { cart_id: cart.id, options: [{ id: shippingOptions.data[0]!.id }] } })
      const { result: paymentCollection } = await createPaymentCollectionForCartWorkflow(container).run({ input: { cart_id: cart.id } })
      await api.post(`/store/payment-collections/${paymentCollection.id}/payment-sessions`, { provider_id: "pp_system_default" }, { headers: { "x-publishable-api-key": apiKeys.data[0]!.token } })

      const { result: completed } = await completeCartWorkflow(container).run({ input: { id: cart.id } })
      const { data } = await query.graph({
        entity: "order",
        fields: ["id", "payment_status", "payment_collections.payment_sessions.provider_id", "payment_collections.payments.captured_at"],
        filters: { id: completed.id },
      })
      const orders = data as unknown as Array<{
        id: string
        payment_status: string
        payment_collections: Array<{
          payment_sessions: Array<{ provider_id: string }>
          payments: Array<{ captured_at: string | null }>
        }>
      }>
      expect(orders).toHaveLength(1)
      expect(String(orders[0]!.payment_status)).not.toMatch(/captured|paid/i)
      expect(orders[0]!.payment_collections[0]!.payment_sessions).toContainEqual(expect.objectContaining({ provider_id: "pp_system_default" }))
      expect(orders[0]!.payment_collections[0]!.payments ?? []).not.toContainEqual(expect.objectContaining({ captured_at: expect.anything() }))
    })

    it("allows only one concurrent checkout to reserve a one-of-one artwork", async () => {
      const container = getContainer()
      const query = container.resolve(ContainerRegistrationKeys.QUERY)
      const { result: submission } = await createVendorProductSubmissionWorkflow(container).run({
        input: {
          vendor_customer_id: "cus_race", vendor_name: "Race Artist", vendor_email: "race@example.com",
          title: "One-of-One Original", description: "An original artwork used to verify atomic checkout inventory reservation.",
          medium: "Ink", dimensions: "20 x 20 cm", price: 12000, quantity: 1, image_url: null,
        },
      })
      const approvalResponse = response()
      await approveVendorProduct({ params: { id: submission.id }, scope: container } as never, approvalResponse as never)
      const productId = approvalResponse.json.mock.calls[0][0].product.id
      const [products, regions, channels, shippingOptions, apiKeys] = await Promise.all([
        query.graph({ entity: "product", fields: ["variants.id"], filters: { id: productId } }),
        query.graph({ entity: "region", fields: ["id"], filters: { name: "India" } }),
        query.graph({ entity: "sales_channel", fields: ["id"], filters: { name: "Colourpalet Storefront" } }),
        query.graph({ entity: "shipping_option", fields: ["id"], filters: { name: "Standard Delivery" } }),
        query.graph({ entity: "api_key", fields: ["token"], filters: { type: "publishable" } }),
      ])
      const variantId = products.data[0]!.variants[0]!.id
      const address = { first_name: "Test", last_name: "Customer", address_1: "1 Studio Road", city: "Mumbai", country_code: "in", postal_code: "400001" }

      const prepareCart = async (email: string) => {
        const { result: cart } = await createCartWorkflow(container).run({
          input: { region_id: regions.data[0]!.id, sales_channel_id: channels.data[0]!.id, email },
        })
        await updateCartWorkflow(container).run({ input: { id: cart.id, shipping_address: address, billing_address: address } })
        await addToCartWorkflow(container).run({ input: { cart_id: cart.id, items: [{ variant_id: variantId, quantity: 1 }] } })
        await addShippingMethodToCartWorkflow(container).run({ input: { cart_id: cart.id, options: [{ id: shippingOptions.data[0]!.id }] } })
        const { result: paymentCollection } = await createPaymentCollectionForCartWorkflow(container).run({ input: { cart_id: cart.id } })
        await api.post(`/store/payment-collections/${paymentCollection.id}/payment-sessions`, { provider_id: "pp_system_default" }, { headers: { "x-publishable-api-key": apiKeys.data[0]!.token } })
        return cart.id
      }

      const cartIds = await Promise.all([prepareCart("first@example.com"), prepareCart("second@example.com")])
      const completions = await Promise.allSettled(
        cartIds.map((id) => completeCartWorkflow(container).run({ input: { id } }))
      )
      const { data: orders } = await query.graph({ entity: "order", fields: ["id", "items.variant_id"] })

      expect(completions.filter((result) => result.status === "fulfilled")).toHaveLength(1)
      expect(completions.filter((result) => result.status === "rejected")).toHaveLength(1)
      expect(orders.filter((order) => order.items?.some((item) => item?.variant_id === variantId))).toHaveLength(1)
    })
  },
})
