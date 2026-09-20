import { Module } from "@medusajs/framework/utils"
import CustomArtworkRequestModuleService from "./service"

export const CUSTOM_ARTWORK_REQUEST_MODULE = "customArtworkRequest"

export default Module(CUSTOM_ARTWORK_REQUEST_MODULE, { service: CustomArtworkRequestModuleService })
