import { MedusaService } from "@medusajs/framework/utils"
import { VendorProductSubmission } from "./models/vendor-product-submission"

class VendorProductSubmissionModuleService extends MedusaService({ VendorProductSubmission }) {}

export default VendorProductSubmissionModuleService
