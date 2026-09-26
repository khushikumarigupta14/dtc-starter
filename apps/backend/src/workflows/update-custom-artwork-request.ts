import { createStep, createWorkflow, StepResponse, WorkflowResponse } from "@medusajs/framework/workflows-sdk"
import { CUSTOM_ARTWORK_REQUEST_MODULE } from "../modules/custom-artwork-request"
import type CustomArtworkRequestModuleService from "../modules/custom-artwork-request/service"

export type CustomArtworkRequestStatus = "new" | "under_review" | "quote_sent" | "approved" | "rejected" | "cancelled"

export type UpdateCustomArtworkRequestInput = {
  id: string
  status?: CustomArtworkRequestStatus
  internal_note?: string | null
}

const updateRequestStep = createStep(
  "update-custom-artwork-request-step",
  async (input: UpdateCustomArtworkRequestInput, { container }) => {
    const service = container.resolve<CustomArtworkRequestModuleService>(CUSTOM_ARTWORK_REQUEST_MODULE)
    const previous = await service.retrieveCustomArtworkRequest(input.id)
    const request = await service.updateCustomArtworkRequests(input)
    return new StepResponse(request, {
      id: previous.id,
      status: previous.status,
      internal_note: previous.internal_note,
    })
  },
  async (previous: UpdateCustomArtworkRequestInput | undefined, { container }) => {
    if (!previous) return
    const service = container.resolve<CustomArtworkRequestModuleService>(CUSTOM_ARTWORK_REQUEST_MODULE)
    await service.updateCustomArtworkRequests(previous)
  }
)

export const updateCustomArtworkRequestWorkflow = createWorkflow(
  "update-custom-artwork-request",
  (input: UpdateCustomArtworkRequestInput) => new WorkflowResponse(updateRequestStep(input))
)
