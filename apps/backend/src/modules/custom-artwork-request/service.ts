import { MedusaService } from "@medusajs/framework/utils"
import { CustomArtworkRequest } from "./models/custom-artwork-request"

class CustomArtworkRequestModuleService extends MedusaService({ CustomArtworkRequest }) {}

export default CustomArtworkRequestModuleService
