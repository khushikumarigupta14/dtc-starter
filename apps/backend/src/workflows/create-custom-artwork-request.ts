import { createStep, createWorkflow, StepResponse, WorkflowResponse } from "@medusajs/framework/workflows-sdk"
import { CUSTOM_ARTWORK_REQUEST_MODULE } from "../modules/custom-artwork-request"
import type CustomArtworkRequestModuleService from "../modules/custom-artwork-request/service"

export type CreateCustomArtworkRequestInput = {
  full_name: string
  email: string
  phone: string | null
  artwork_type: string
  preferred_medium: string | null
  size: string | null
  orientation: string | null
  required_date: Date | null
  instructions: string
  inspired_by_product_id: string | null
}

const createRequestStep = createStep(
  "create-request",
  async (input: CreateCustomArtworkRequestInput, { container }) => {
    const service = container.resolve<CustomArtworkRequestModuleService>(CUSTOM_ARTWORK_REQUEST_MODULE)
    const request = await service.createCustomArtworkRequests(input)
    return new StepResponse(request, request.id)
  },
  async (id: string | undefined, { container }) => {
    if (!id) return
    const service = container.resolve<CustomArtworkRequestModuleService>(CUSTOM_ARTWORK_REQUEST_MODULE)
    await service.deleteCustomArtworkRequests(id)
  }
)

export const createCustomArtworkRequestWorkflow = createWorkflow(
  "create-custom-artwork-request",
  (input: CreateCustomArtworkRequestInput) => {
    const request = createRequestStep(input)
    return new WorkflowResponse(request)
  }
)
