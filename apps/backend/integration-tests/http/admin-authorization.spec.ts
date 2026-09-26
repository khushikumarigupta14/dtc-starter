import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import { createHmac } from "node:crypto"
import { Modules } from "@medusajs/framework/utils"
import initialDataSeed from "../../src/migration-scripts/initial-data-seed"
import { VENDOR_PRODUCT_SUBMISSION_MODULE } from "../../src/modules/vendor-product-submission"
import type VendorProductSubmissionModuleService from "../../src/modules/vendor-product-submission/service"
import { createCustomArtworkRequestWorkflow } from "../../src/workflows/create-custom-artwork-request"
import { createVendorProductSubmissionWorkflow } from "../../src/workflows/create-vendor-product-submission"

jest.setTimeout(180_000)

function signAdminToken(payload: Record<string, string>) {
  const encode = (value: object) => Buffer.from(JSON.stringify(value)).toString("base64url")
  const unsigned = `${encode({ alg: "HS256", typ: "JWT" })}.${encode({
    ...payload,
    exp: Math.floor(Date.now() / 1000) + 3600,
  })}`
  const signature = createHmac("sha256", process.env.JWT_SECRET!).update(unsigned).digest("base64url")
  return `${unsigned}.${signature}`
}

medusaIntegrationTestRunner({
  moduleName: "colourpalet-admin-authorization",
  inApp: true,
  testSuite: ({ api, getContainer }) => {
    beforeEach(async () => initialDataSeed({ container: getContainer() }))

    it("rejects anonymous access to custom Admin listing and review APIs", async () => {
      const container = getContainer()
      const { result: submission } = await createVendorProductSubmissionWorkflow(container).run({
        input: {
          vendor_customer_id: "cus_authz", vendor_name: "Authorization Artist", vendor_email: "authz@example.com",
          title: "Protected Original", description: "An artwork whose review operations must remain Admin-only.",
          medium: "Charcoal", dimensions: "24 x 30 cm", price: 9000, quantity: 1, image_url: null,
        },
      })
      const request = { validateStatus: () => true }

      const [customList, vendorList, approval] = await Promise.all([
        api.get("/admin/custom-artwork-requests", request),
        api.get("/admin/vendor-products", request),
        api.post(`/admin/vendor-products/${submission.id}/approve`, {}, request),
      ])

      expect(customList.status).toBe(401)
      expect(vendorList.status).toBe(401)
      expect(approval.status).toBe(401)
      const service = container.resolve<VendorProductSubmissionModuleService>(VENDOR_PRODUCT_SUBMISSION_MODULE)
      await expect(service.retrieveVendorProductSubmission(submission.id)).resolves.toEqual(
        expect.objectContaining({ status: "pending", product_id: null })
      )
    })

    it("does not allow a customer bearer token to access Admin APIs", async () => {
      const registration = await api.post("/auth/customer/emailpass/register", {
        email: "customer-authz@example.com",
        password: "CustomerPassword123!",
      })
      const headers = { authorization: `Bearer ${registration.data.token}` }
      const request = { headers, validateStatus: () => true }

      const [customList, vendorList] = await Promise.all([
        api.get("/admin/custom-artwork-requests", request),
        api.get("/admin/vendor-products", request),
      ])

      expect([401, 403]).toContain(customList.status)
      expect([401, 403]).toContain(vendorList.status)
    })

    it("allows an authenticated Admin to list and approve submissions", async () => {
      const container = getContainer()
      const userService = container.resolve(Modules.USER)
      const authService = container.resolve(Modules.AUTH)
      const user = await userService.createUsers({ email: "admin-authz@example.com" })
      const identity = await authService.createAuthIdentities({
        provider_identities: [{
          provider: "emailpass",
          entity_id: user.email,
          provider_metadata: { password: "AdminPassword123!" },
        }],
        app_metadata: { user_id: user.id },
      })
      const headers = {
        authorization: `Bearer ${signAdminToken({
          actor_id: user.id,
          actor_type: "user",
          auth_identity_id: identity.id,
        })}`,
      }
      const { result: submission } = await createVendorProductSubmissionWorkflow(container).run({
        input: {
          vendor_customer_id: "cus_admin_success", vendor_name: "Admin Success Artist", vendor_email: "success@example.com",
          title: "Admin Approved Original", description: "An original used to verify authenticated Admin review over real HTTP.",
          medium: "Pastel", dimensions: "25 x 35 cm", price: 14000, quantity: 1, image_url: null,
        },
      })
      const { result: customRequest } = await createCustomArtworkRequestWorkflow(container).run({
        input: {
          full_name: "Commission Customer", email: "commission@example.com", phone: null,
          artwork_type: "Portrait", preferred_medium: "Pastel", size: null, orientation: null,
          required_date: null, instructions: "A family portrait for an anniversary.", inspired_by_product_id: null,
        },
      })

      const [customList, vendorList] = await Promise.all([
        api.get("/admin/custom-artwork-requests", { headers }),
        api.get("/admin/vendor-products", { headers }),
      ])
      const invalidTransition = await api.post(
        `/admin/custom-artwork-requests/${customRequest.id}`,
        { status: "approved", internal_note: "This jump must not be accepted." },
        { headers, validateStatus: () => true }
      )
      const customUpdate = await api.post(
        `/admin/custom-artwork-requests/${customRequest.id}`,
        { status: "under_review", internal_note: "Customer contacted; awaiting reference photos." },
        { headers }
      )
      const approval = await api.post(`/admin/vendor-products/${submission.id}/approve`, {}, { headers })

      expect(customList.status).toBe(200)
      expect(customList.data.custom_artwork_requests).toContainEqual(expect.objectContaining({ id: customRequest.id, status: "new" }))
      expect(invalidTransition.status).toBe(400)
      expect(customUpdate.data.custom_artwork_request).toEqual(expect.objectContaining({
        id: customRequest.id,
        status: "under_review",
        internal_note: "Customer contacted; awaiting reference photos.",
      }))
      expect(vendorList.status).toBe(200)
      expect(vendorList.data.vendor_products).toContainEqual(expect.objectContaining({ id: submission.id }))
      expect(approval.status).toBe(200)
      expect(approval.data.vendor_product).toEqual(expect.objectContaining({ id: submission.id, status: "approved" }))
      expect(approval.data.product).toEqual(expect.objectContaining({ status: "published" }))
    })
  },
})
