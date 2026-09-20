"use server"

import { sdk } from "@lib/config"

export type CustomArtworkRequestState = {
  success: boolean
  message: string
}

export async function submitCustomArtworkRequest(
  _previousState: CustomArtworkRequestState,
  formData: FormData
): Promise<CustomArtworkRequestState> {
  const value = (name: string) => String(formData.get(name) ?? "").trim()
  const payload = {
    full_name: value("full_name"),
    email: value("email"),
    phone: value("phone") || undefined,
    artwork_type: value("artwork_type"),
    preferred_medium: value("preferred_medium") || undefined,
    size: value("size") || undefined,
    orientation: value("orientation") || undefined,
    required_date: value("required_date") || undefined,
    instructions: value("instructions"),
    inspired_by_product_id: value("inspired_by_product_id") || undefined,
  }

  try {
    await sdk.client.fetch("/store/custom-artwork-requests", {
      method: "POST",
      body: payload,
    })
    return {
      success: true,
      message: "Thank you. Your request has been received and our studio will contact you soon.",
    }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "We could not submit your request. Please try again.",
    }
  }
}
