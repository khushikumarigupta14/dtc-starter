import { model } from "@medusajs/framework/utils"

export const CustomArtworkRequest = model.define("custom_artwork_request", {
  id: model.id().primaryKey(),
  full_name: model.text(),
  email: model.text(),
  phone: model.text().nullable(),
  artwork_type: model.text(),
  preferred_medium: model.text().nullable(),
  size: model.text().nullable(),
  orientation: model.text().nullable(),
  required_date: model.dateTime().nullable(),
  instructions: model.text(),
  inspired_by_product_id: model.text().nullable(),
  status: model.enum(["new", "under_review", "quote_sent", "approved", "rejected", "cancelled"]).default("new"),
  internal_note: model.text().nullable(),
})
