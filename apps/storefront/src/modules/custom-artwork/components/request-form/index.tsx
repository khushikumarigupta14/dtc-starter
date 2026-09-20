"use client"

import { submitCustomArtworkRequest, type CustomArtworkRequestState } from "@lib/data/custom-artwork-requests"
import { Button } from "@modules/common/components/ui"
import { useActionState } from "react"

const initialState: CustomArtworkRequestState = { success: false, message: "" }

export default function CustomArtworkRequestForm({ inspiredBy }: { inspiredBy?: string }) {
  const [state, action, pending] = useActionState(submitCustomArtworkRequest, initialState)
  const fieldClass = "w-full rounded-md border border-ui-border-base bg-white px-3 py-3 text-sm outline-none transition focus:border-stone-700 focus:ring-2 focus:ring-stone-200"

  if (state.success) {
    return (
      <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-6" role="status">
        <h2 className="text-xl font-medium text-emerald-950">Request received</h2>
        <p className="mt-2 text-sm text-emerald-900">{state.message}</p>
      </div>
    )
  }

  return (
    <form action={action} className="grid gap-5" aria-describedby="form-note">
      {inspiredBy && <input type="hidden" name="inspired_by_product_id" value={inspiredBy} />}
      <div className="grid gap-5 small:grid-cols-2">
        <label className="grid gap-2 text-sm font-medium">Full name<input className={fieldClass} name="full_name" required minLength={2} maxLength={120} autoComplete="name" /></label>
        <label className="grid gap-2 text-sm font-medium">Email<input className={fieldClass} name="email" type="email" required maxLength={254} autoComplete="email" /></label>
        <label className="grid gap-2 text-sm font-medium">Phone (optional)<input className={fieldClass} name="phone" type="tel" maxLength={30} autoComplete="tel" /></label>
        <label className="grid gap-2 text-sm font-medium">Artwork type<select className={fieldClass} name="artwork_type" required defaultValue=""><option value="" disabled>Select artwork type</option><option>Portrait</option><option>Painting</option><option>Drawing</option><option>Other</option></select></label>
        <label className="grid gap-2 text-sm font-medium">Preferred medium<select className={fieldClass} name="preferred_medium" defaultValue=""><option value="">No preference</option><option>Acrylic</option><option>Oil</option><option>Watercolour</option><option>Pencil</option><option>Charcoal</option><option>Mixed media</option></select></label>
        <label className="grid gap-2 text-sm font-medium">Size (optional)<input className={fieldClass} name="size" maxLength={80} placeholder="For example, A3 or 18 × 24 inches" /></label>
        <label className="grid gap-2 text-sm font-medium">Orientation<select className={fieldClass} name="orientation" defaultValue=""><option value="">No preference</option><option>Portrait</option><option>Landscape</option><option>Square</option></select></label>
        <label className="grid gap-2 text-sm font-medium">Required by (optional)<input className={fieldClass} name="required_date" type="date" /></label>
      </div>
      <label className="grid gap-2 text-sm font-medium">Tell us about the artwork<textarea className={`${fieldClass} min-h-36 resize-y`} name="instructions" required minLength={10} maxLength={4000} placeholder="Subject, colours, number of people, mood, and any other details…" /></label>
      <p id="form-note" className="text-xs text-ui-fg-muted">This is an enquiry, not an order. We will review the request and contact you before any price or timeline is agreed.</p>
      {state.message && <p className="text-sm text-red-700" role="alert">{state.message}</p>}
      <Button type="submit" size="large" disabled={pending} isLoading={pending} className="w-full small:w-fit">Send artwork request</Button>
    </form>
  )
}
