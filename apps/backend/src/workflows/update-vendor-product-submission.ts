import { createStep, createWorkflow, StepResponse, WorkflowResponse } from "@medusajs/framework/workflows-sdk"
import { VENDOR_PRODUCT_SUBMISSION_MODULE } from "../modules/vendor-product-submission"
import type VendorProductSubmissionModuleService from "../modules/vendor-product-submission/service"

export type UpdateVendorProductSubmissionInput = {
  id: string
  status: "pending" | "processing" | "approved" | "rejected"
  product_id?: string | null
  review_note?: string | null
}

const updateSubmissionStep = createStep(
  "update-submission",
  async (input: UpdateVendorProductSubmissionInput, { container }) => {
    const service = container.resolve<VendorProductSubmissionModuleService>(VENDOR_PRODUCT_SUBMISSION_MODULE)
    const previous = await service.retrieveVendorProductSubmission(input.id)
    const submission = await service.updateVendorProductSubmissions(input)
    return new StepResponse(submission, {
      id: previous.id,
      status: previous.status,
      product_id: previous.product_id,
      review_note: previous.review_note,
    })
  },
  async (previous: UpdateVendorProductSubmissionInput | undefined, { container }) => {
    if (!previous) return
    const service = container.resolve<VendorProductSubmissionModuleService>(VENDOR_PRODUCT_SUBMISSION_MODULE)
    await service.updateVendorProductSubmissions(previous)
  }
)

export const updateVendorProductSubmissionWorkflow = createWorkflow(
  "update-vendor-product-submission",
  (input: UpdateVendorProductSubmissionInput) => {
    const submission = updateSubmissionStep(input)
    return new WorkflowResponse(submission)
  }
)
