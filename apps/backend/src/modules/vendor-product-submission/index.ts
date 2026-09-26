import { Module } from "@medusajs/framework/utils"
import VendorProductSubmissionModuleService from "./service"

export const VENDOR_PRODUCT_SUBMISSION_MODULE = "vendorProductSubmission"

export default Module(VENDOR_PRODUCT_SUBMISSION_MODULE, {
  service: VendorProductSubmissionModuleService,
})
