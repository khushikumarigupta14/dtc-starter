"use client"

import { submitVendorProduct, type VendorProductActionState } from "@lib/data/vendor-products"
import { useActionState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"

const initialState: VendorProductActionState = null
const fieldClass =
  "min-h-12 w-full border border-[var(--color-line)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-ink)] outline-none transition focus:border-[var(--color-accent)]"

export default function VendorProductForm() {
  const [state, action, pending] = useActionState(submitVendorProduct, initialState)
  const formRef = useRef<HTMLFormElement>(null)
  const router = useRouter()

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset()
      router.refresh()
    }
  }, [state, router])

  return (
    <form ref={formRef} action={action} className="paper-panel p-6 small:p-8">
      <p className="editorial-kicker">New submission</p>
      <h2 className="mt-3 font-display text-3xl leading-tight">Add an artwork</h2>
      <p className="mt-2 max-w-2xl text-sm text-[var(--color-muted)]">
        Your artwork remains private until the Colourpalet team approves it.
      </p>

      <div className="mt-8 grid gap-5 small:grid-cols-2">
        <label className="grid gap-2 text-sm font-semibold small:col-span-2">
          Artwork title
          <input className={fieldClass} name="title" required minLength={3} maxLength={160} />
        </label>
        <label className="grid gap-2 text-sm font-semibold">
          Medium
          <input className={fieldClass} name="medium" placeholder="Oil on canvas" required maxLength={80} />
        </label>
        <label className="grid gap-2 text-sm font-semibold">
          Dimensions
          <input className={fieldClass} name="dimensions" placeholder="60 × 45 cm" required maxLength={80} />
        </label>
        <label className="grid gap-2 text-sm font-semibold">
          Price in INR
          <input className={fieldClass} name="price" type="number" min={1} step={1} required />
        </label>
        <label className="grid gap-2 text-sm font-semibold">
          Available quantity
          <input className={fieldClass} name="quantity" type="number" min={1} max={1000} step={1} defaultValue={1} required />
        </label>
        <label className="grid gap-2 text-sm font-semibold small:col-span-2">
          Description
          <textarea className={fieldClass} name="description" rows={5} required minLength={20} maxLength={4000} />
        </label>
        <label className="grid gap-2 text-sm font-semibold small:col-span-2">
          Artwork image
          <span className="border border-dashed border-[var(--color-line)] bg-[#faf6ee] p-6">
            <input name="image" type="file" accept="image/jpeg,image/png,image/webp" className="block w-full text-sm" />
            <span className="mt-2 block text-xs font-normal text-[var(--color-muted)]">JPG, PNG or WebP, up to 7 MB.</span>
          </span>
        </label>
      </div>

      {state && (
        <p className={"mt-5 text-sm " + (state.success ? "text-[#55705d]" : "text-red-700")} role="status">
          {state.message}
        </p>
      )}

      <button className="theme-button-primary mt-6 disabled:cursor-not-allowed disabled:opacity-60" disabled={pending}>
        {pending ? "Submitting…" : "Submit for approval"}
      </button>
    </form>
  )
}
