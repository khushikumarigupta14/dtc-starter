import type { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys, MedusaError } from "@medusajs/framework/utils"
import { z } from "@medusajs/framework/zod"
import { uploadFilesWorkflow } from "@medusajs/medusa/core-flows"
import { VENDOR_PRODUCT_SUBMISSION_MODULE } from "../../../modules/vendor-product-submission"
import type VendorProductSubmissionModuleService from "../../../modules/vendor-product-submission/service"
import { createVendorProductSubmissionWorkflow } from "../../../workflows/create-vendor-product-submission"

const submissionSchema = z.object({
  title: z.string().trim().min(3).max(160),
  description: z.string().trim().min(20).max(4000),
  medium: z.string().trim().min(2).max(80),
  dimensions: z.string().trim().min(2).max(80),
  price: z.number().int().min(1).max(100000000),
  quantity: z.number().int().min(1).max(1000).default(1),
  image: z.object({
    filename: z.string().trim().min(1).max(180),
    mime_type: z.enum(["image/jpeg", "image/png", "image/webp"]),
    content: z.string().min(1).max(10_000_000),
  }).optional(),
})

function customerId(req: AuthenticatedMedusaRequest) {
  const id = req.auth_context?.actor_id
  if (!id) {
    throw new MedusaError(MedusaError.Types.UNAUTHORIZED, "Sign in to access the vendor dashboard")
  }
  return id
}

export async function GET(req: AuthenticatedMedusaRequest, res: MedusaResponse) {
  const service = req.scope.resolve<VendorProductSubmissionModuleService>(VENDOR_PRODUCT_SUBMISSION_MODULE)
  const [submissions, count] = await service.listAndCountVendorProductSubmissions(
    { vendor_customer_id: customerId(req) },
    { order: { created_at: "DESC" } }
  )
  res.json({ vendor_products: submissions, count })
}

export async function POST(req: AuthenticatedMedusaRequest, res: MedusaResponse) {
  const parsed = submissionSchema.safeParse(req.body)
  if (!parsed.success) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, parsed.error.issues[0]?.message ?? "Invalid artwork submission")
  }

  const id = customerId(req)
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const { data: customers } = await query.graph({
    entity: "customer",
    fields: ["id", "first_name", "last_name", "email"],
    filters: { id },
  })
  const customer = customers[0]
  if (!customer?.email) {
    throw new MedusaError(MedusaError.Types.NOT_FOUND, "Customer account not found")
  }

  let imageUrl: string | null = null
  if (parsed.data.image) {
    const { result } = await uploadFilesWorkflow(req.scope).run({
      input: {
        files: [{
          filename: parsed.data.image.filename,
          mimeType: parsed.data.image.mime_type,
          content: parsed.data.image.content,
          access: "public",
        }],
      },
    })
    imageUrl = result[0]?.url ?? null
  }

  const { result: submission } = await createVendorProductSubmissionWorkflow(req.scope).run({
    input: {
      vendor_customer_id: id,
      vendor_name: [customer.first_name, customer.last_name].filter(Boolean).join(" ") || customer.email,
      vendor_email: customer.email,
      title: parsed.data.title,
      description: parsed.data.description,
      medium: parsed.data.medium,
      dimensions: parsed.data.dimensions,
      price: parsed.data.price,
      quantity: parsed.data.quantity,
      image_url: imageUrl,
    },
  })

  res.status(201).json({ vendor_product: submission })
}
