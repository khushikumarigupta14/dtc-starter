import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { MedusaError } from "@medusajs/framework/utils"
import { z } from "@medusajs/framework/zod"
import { createCustomArtworkRequestWorkflow } from "../../../workflows/create-custom-artwork-request"

const requestSchema = z.object({
  full_name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().max(30).optional(),
  artwork_type: z.string().trim().min(2).max(80),
  preferred_medium: z.string().trim().max(80).optional(),
  size: z.string().trim().max(80).optional(),
  orientation: z.string().trim().max(40).optional(),
  required_date: z.string().date().optional(),
  instructions: z.string().trim().min(10).max(4000),
  inspired_by_product_id: z.string().trim().max(120).optional(),
})

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const parsed = requestSchema.safeParse(req.body)
  if (!parsed.success) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, parsed.error.issues[0]?.message ?? "Invalid custom artwork request")
  }
  const data = parsed.data
  const { result: request } = await createCustomArtworkRequestWorkflow(req.scope).run({
    input: {
      ...data,
      phone: data.phone || null,
      preferred_medium: data.preferred_medium || null,
      size: data.size || null,
      orientation: data.orientation || null,
      required_date: data.required_date ? new Date(data.required_date) : null,
      inspired_by_product_id: data.inspired_by_product_id || null,
    },
  })
  res.status(201).json({ custom_artwork_request: request })
}
