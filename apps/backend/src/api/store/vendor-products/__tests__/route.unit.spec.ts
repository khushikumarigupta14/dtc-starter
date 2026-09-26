import { MedusaError } from "@medusajs/framework/utils"
import { GET, POST } from "../route"
import { createVendorProductSubmissionWorkflow } from "../../../../workflows/create-vendor-product-submission"

jest.mock("@medusajs/medusa/core-flows", () => ({ uploadFilesWorkflow: jest.fn() }))
jest.mock("../../../../workflows/create-vendor-product-submission", () => ({
  createVendorProductSubmissionWorkflow: jest.fn(),
}))

const workflow = jest.mocked(createVendorProductSubmissionWorkflow)

function response() {
  const res = { status: jest.fn(), json: jest.fn() }
  res.status.mockReturnValue(res)
  return res
}

describe("/store/vendor-products", () => {
  beforeEach(() => jest.clearAllMocks())

  it("requires an authenticated customer", async () => {
    const service = { listAndCountVendorProductSubmissions: jest.fn() }
    const req = { auth_context: undefined, scope: { resolve: jest.fn().mockReturnValue(service) } }

    await expect(GET(req as never, response() as never)).rejects.toBeInstanceOf(MedusaError)
    expect(service.listAndCountVendorProductSubmissions).not.toHaveBeenCalled()
  })

  it("scopes listings to the authenticated customer", async () => {
    const service = {
      listAndCountVendorProductSubmissions: jest.fn().mockResolvedValue([[{ id: "vps_1" }], 1]),
    }
    const req = {
      auth_context: { actor_id: "cus_owner" },
      scope: { resolve: jest.fn().mockReturnValue(service) },
    }
    const res = response()

    await GET(req as never, res as never)

    expect(service.listAndCountVendorProductSubmissions).toHaveBeenCalledWith(
      { vendor_customer_id: "cus_owner" },
      { order: { created_at: "DESC" } }
    )
    expect(res.json).toHaveBeenCalledWith({ vendor_products: [{ id: "vps_1" }], count: 1 })
  })

  it("rejects invalid values before starting a workflow", async () => {
    const req = {
      auth_context: { actor_id: "cus_owner" },
      body: { title: "No", description: "Too short" },
      scope: { resolve: jest.fn() },
    }

    await expect(POST(req as never, response() as never)).rejects.toBeInstanceOf(MedusaError)
    expect(workflow).not.toHaveBeenCalled()
  })
})
