"use server"

import { sdk } from "@lib/config"
import { getAuthHeaders } from "./cookies"
import { revalidatePath } from "next/cache"

export type VendorProductStatus = "pending" | "processing" | "approved" | "rejected"

export type VendorProduct = {
  id: string
  title: string
  description: string
  medium: string
  dimensions: string
  price: number
  quantity: number
  image_url: string | null
  status: VendorProductStatus
  product_id: string | null
  review_note: string | null
  created_at: string
}

export type VendorProductActionState = {
  success: boolean
  message: string
} | null

export async function listVendorProducts(): Promise<VendorProduct[]> {
  const headers = await getAuthHeaders()
  const response = await sdk.client.fetch<{ vendor_products: VendorProduct[] }>("/store/vendor-products", {
    method: "GET",
    headers,
    cache: "no-store",
  })
  return response.vendor_products
}

export async function submitVendorProduct(
  _state: VendorProductActionState,
  formData: FormData
): Promise<VendorProductActionState> {
  const image = formData.get("image")
  let encodedImage:
    | { filename: string; mime_type: "image/jpeg" | "image/png" | "image/webp"; content: string }
    | undefined

  if (image instanceof File && image.size > 0) {
    const allowed = ["image/jpeg", "image/png", "image/webp"] as const
    if (!allowed.includes(image.type as (typeof allowed)[number])) {
      return { success: false, message: "Upload a JPG, PNG, or WebP image." }
    }
    if (image.size > 7_000_000) {
      return { success: false, message: "Image must be smaller than 7 MB." }
    }
    encodedImage = {
      filename: image.name,
      mime_type: image.type as (typeof allowed)[number],
      content: Buffer.from(await image.arrayBuffer()).toString("base64"),
    }
  }

  try {
    await sdk.client.fetch("/store/vendor-products", {
      method: "POST",
      headers: await getAuthHeaders(),
      body: {
        title: String(formData.get("title") ?? ""),
        description: String(formData.get("description") ?? ""),
        medium: String(formData.get("medium") ?? ""),
        dimensions: String(formData.get("dimensions") ?? ""),
        price: Number(formData.get("price")),
        quantity: Number(formData.get("quantity")),
        image: encodedImage,
      },
    })
    revalidatePath("/[countryCode]/account/vendor-products", "page")
    return { success: true, message: "Artwork submitted for admin review." }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Could not submit the artwork.",
    }
  }
}
