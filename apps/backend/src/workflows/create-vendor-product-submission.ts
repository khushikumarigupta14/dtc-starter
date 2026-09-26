import { createStep, createWorkflow, StepResponse, WorkflowResponse } from "@medusajs/framework/workflows-sdk"
import { VENDOR_PRODUCT_SUBMISSION_MODULE } from "../modules/vendor-product-submission"
import type VendorProductSubmissionModuleService from "../modules/vendor-product-submission/service"

export type CreateVendorProductSubmissionInput = {
  vendor_customer_id: string
  vendor_name: string
  vendor_email: string
  title: string
  description: string
  medium: string
  dimensions: string
  price: number
  quantity: number
  image_url: string | null
}

const createSubmissionStep = createStep(
  "create-submission",
  async (input: CreateVendorProductSubmissionInput, { container }) => {
    const service = container.resolve<VendorProductSubmissionModuleService>(VENDOR_PRODUCT_SUBMISSION_MODULE)
    const submission = await service.createVendorProductSubmissions({
      ...input,
      status: "pending",
      product_id: null,
      review_note: null,
    })
    return new StepResponse(submission, submission.id)
  },
  async (id: string | undefined, { container }) => {
    if (!id) return
    const service = container.resolve<VendorProductSubmissionModuleService>(VENDOR_PRODUCT_SUBMISSION_MODULE)
    await service.deleteVendorProductSubmissions(id)
  }
)

export const createVendorProductSubmissionWorkflow = createWorkflow(
  "create-vendor-product-submission",
  (input: CreateVendorProductSubmissionInput) => {
    const submission = createSubmissionStep(input)
    return new WorkflowResponse(submission)
  }
)
