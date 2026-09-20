import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { CUSTOM_ARTWORK_REQUEST_MODULE } from "../../../modules/custom-artwork-request"
import type CustomArtworkRequestModuleService from "../../../modules/custom-artwork-request/service"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const service = req.scope.resolve<CustomArtworkRequestModuleService>(CUSTOM_ARTWORK_REQUEST_MODULE)
  const [requests, count] = await service.listAndCountCustomArtworkRequests({}, { order: { created_at: "DESC" } })
  res.json({ custom_artwork_requests: requests, count })
}
