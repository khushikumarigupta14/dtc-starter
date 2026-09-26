import { MedusaError } from "@medusajs/framework/utils"
import { POST } from "../route"
import { updateVendorProductSubmissionWorkflow } from "../../../../../../workflows/update-vendor-product-submission"

jest.mock("../../../../../../workflows/update-vendor-product-submission", () => ({
  updateVendorProductSubmissionWorkflow: jest.fn(),
}))

const workflow = jest.mocked(updateVendorProductSubmissionWorkflow)

function response() {
  return { json: jest.fn() }
}

describe("POST /admin/vendor-products/:id/reject", () => {
  beforeEach(() => jest.clearAllMocks())

  it("requires a useful rejection note", async () => {
    const req = { body: { note: "" }, params: { id: "vps_1" }, scope: { resolve: jest.fn() } }

    await expect(POST(req as never, response() as never)).rejects.toBeInstanceOf(MedusaError)
    expect(req.scope.resolve).not.toHaveBeenCalled()
  })

  it("rejects an already reviewed submission", async () => {
    const service = {
      retrieveVendorProductSubmission: jest.fn().mockResolvedValue({ id: "vps_1", status: "approved" }),
    }
    const req = {
      body: { note: "Please add a clearer image." },
      params: { id: "vps_1" },
      scope: { resolve: jest.fn().mockReturnValue(service) },
    }

    await expect(POST(req as never, response() as never)).rejects.toBeInstanceOf(MedusaError)
    expect(workflow).not.toHaveBeenCalled()
  })

  it("preserves the trimmed note when rejecting a pending submission", async () => {
    const service = {
      retrieveVendorProductSubmission: jest.fn().mockResolvedValue({ id: "vps_1", status: "pending" }),
    }
    const run = jest.fn().mockResolvedValue({
      result: { id: "vps_1", status: "rejected", review_note: "Please add a clearer image." },
    })
    workflow.mockReturnValue({ run } as never)
    const req = {
      body: { note: "  Please add a clearer image.  " },
      params: { id: "vps_1" },
      scope: { resolve: jest.fn().mockReturnValue(service) },
    }
    const res = response()

    await POST(req as never, res as never)

    expect(run).toHaveBeenCalledWith({
      input: {
        id: "vps_1",
        status: "rejected",
        review_note: "Please add a clearer image.",
      },
    })
    expect(res.json).toHaveBeenCalledWith({
      vendor_product: { id: "vps_1", status: "rejected", review_note: "Please add a clearer image." },
    })
  })
})
