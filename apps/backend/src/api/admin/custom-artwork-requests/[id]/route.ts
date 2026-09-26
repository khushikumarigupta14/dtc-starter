import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { MedusaError } from "@medusajs/framework/utils"
import { z } from "zod"
import { CUSTOM_ARTWORK_REQUEST_MODULE } from "../../../../modules/custom-artwork-request"
import type CustomArtworkRequestModuleService from "../../../../modules/custom-artwork-request/service"
import {
  type CustomArtworkRequestStatus,
  updateCustomArtworkRequestWorkflow,
} from "../../../../workflows/update-custom-artwork-request"

const statuses = ["new", "under_review", "quote_sent", "approved", "rejected", "cancelled"] as const
const bodySchema = z.object({
  status: z.enum(statuses).optional(),
  internal_note: z.string().trim().max(2000).nullable().optional(),
}).refine((body) => body.status !== undefined || body.internal_note !== undefined, {
  message: "Provide a status or internal note",
})

const transitions: Record<CustomArtworkRequestStatus, CustomArtworkRequestStatus[]> = {
  new: ["under_review", "cancelled"],
  under_review: ["quote_sent", "rejected", "cancelled"],
  quote_sent: ["under_review", "approved", "rejected", "cancelled"],
  approved: ["under_review"],
  rejected: ["under_review"],
  cancelled: ["under_review"],
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const parsed = bodySchema.safeParse(req.body)
  if (!parsed.success) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, parsed.error.issues[0]?.message ?? "Invalid request")
  }

  const service = req.scope.resolve<CustomArtworkRequestModuleService>(CUSTOM_ARTWORK_REQUEST_MODULE)
  const current = await service.retrieveCustomArtworkRequest(req.params.id)
  const nextStatus = parsed.data.status
  if (nextStatus && nextStatus !== current.status && !transitions[current.status as CustomArtworkRequestStatus].includes(nextStatus)) {
    throw new MedusaError(MedusaError.Types.NOT_ALLOWED, `Cannot move a ${current.status} request to ${nextStatus}`)
  }

  const { result } = await updateCustomArtworkRequestWorkflow(req.scope).run({
    input: {
      id: current.id,
      ...(nextStatus ? { status: nextStatus } : {}),
      ...(parsed.data.internal_note !== undefined
        ? { internal_note: parsed.data.internal_note || null }
        : {}),
    },
  })
  res.json({ custom_artwork_request: result })
}
