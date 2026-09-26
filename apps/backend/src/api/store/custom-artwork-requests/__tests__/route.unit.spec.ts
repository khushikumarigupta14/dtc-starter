import { MedusaError } from "@medusajs/framework/utils"
import { POST } from "../route"
import { createCustomArtworkRequestWorkflow } from "../../../../workflows/create-custom-artwork-request"

jest.mock("../../../../workflows/create-custom-artwork-request", () => ({
  createCustomArtworkRequestWorkflow: jest.fn(),
}))

const workflow = jest.mocked(createCustomArtworkRequestWorkflow)

function response() {
  const res = { status: jest.fn(), json: jest.fn() }
  res.status.mockReturnValue(res)
  return res
}

describe("POST /store/custom-artwork-requests", () => {
  beforeEach(() => jest.clearAllMocks())

  it("rejects invalid details before starting the workflow", async () => {
    const req = { body: { full_name: "A", email: "not-an-email" }, scope: {} }

    await expect(POST(req as never, response() as never)).rejects.toBeInstanceOf(MedusaError)
    expect(workflow).not.toHaveBeenCalled()
  })

  it("normalizes optional values and converts the required date", async () => {
    const run = jest.fn().mockResolvedValue({ result: { id: "car_1" } })
    workflow.mockReturnValue({ run } as never)
    const res = response()
    const req = {
      scope: {},
      body: {
        full_name: "  Ada Artist  ",
        email: "ada@example.com",
        phone: "",
        artwork_type: " Portrait ",
        preferred_medium: "",
        size: "",
        orientation: "",
        required_date: "2026-12-15",
        instructions: "  Please create a warm family portrait.  ",
        inspired_by_product_id: "",
      },
    }

    await POST(req as never, res as never)

    expect(run).toHaveBeenCalledWith({
      input: expect.objectContaining({
        full_name: "Ada Artist",
        artwork_type: "Portrait",
        phone: null,
        preferred_medium: null,
        size: null,
        orientation: null,
        inspired_by_product_id: null,
        required_date: new Date("2026-12-15"),
      }),
    })
    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.json).toHaveBeenCalledWith({ custom_artwork_request: { id: "car_1" } })
  })
})
