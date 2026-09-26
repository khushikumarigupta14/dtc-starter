import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { VENDOR_PRODUCT_SUBMISSION_MODULE } from "../../../modules/vendor-product-submission"
import type VendorProductSubmissionModuleService from "../../../modules/vendor-product-submission/service"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const service = req.scope.resolve<VendorProductSubmissionModuleService>(VENDOR_PRODUCT_SUBMISSION_MODULE)
  const [submissions, count] = await service.listAndCountVendorProductSubmissions({}, { order: { created_at: "DESC" } })
  res.json({ vendor_products: submissions, count })
}
