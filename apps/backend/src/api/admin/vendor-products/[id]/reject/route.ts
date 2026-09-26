import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { MedusaError } from "@medusajs/framework/utils"
import { z } from "@medusajs/framework/zod"
import { VENDOR_PRODUCT_SUBMISSION_MODULE } from "../../../../../modules/vendor-product-submission"
import type VendorProductSubmissionModuleService from "../../../../../modules/vendor-product-submission/service"
import { updateVendorProductSubmissionWorkflow } from "../../../../../workflows/update-vendor-product-submission"

const schema = z.object({ note: z.string().trim().min(3).max(1000) })

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const parsed = schema.safeParse(req.body)
  if (!parsed.success) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, "A rejection note is required")
  }
  const service = req.scope.resolve<VendorProductSubmissionModuleService>(VENDOR_PRODUCT_SUBMISSION_MODULE)
  const submission = await service.retrieveVendorProductSubmission(req.params.id)
  if (submission.status !== "pending") {
    throw new MedusaError(MedusaError.Types.NOT_ALLOWED, "Only pending submissions can be rejected")
  }
  const { result: rejected } = await updateVendorProductSubmissionWorkflow(req.scope).run({
    input: {
      id: submission.id,
      status: "rejected",
      review_note: parsed.data.note,
    },
  })
  res.json({ vendor_product: rejected })
}
