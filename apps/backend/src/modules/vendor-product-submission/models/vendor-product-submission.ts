import { model } from "@medusajs/framework/utils"

export const VendorProductSubmission = model.define("vendor_product_submission", {
  id: model.id().primaryKey(),
  vendor_customer_id: model.text(),
  vendor_name: model.text(),
  vendor_email: model.text(),
  title: model.text(),
  description: model.text(),
  medium: model.text(),
  dimensions: model.text(),
  price: model.number(),
  quantity: model.number().default(1),
  image_url: model.text().nullable(),
  status: model.enum(["pending", "processing", "approved", "rejected"]).default("pending"),
  product_id: model.text().nullable(),
  review_note: model.text().nullable(),
})
