# UI Guidelines

The storefront should feel artwork-first, calm, and accessible. Use semantic HTML, visible keyboard focus, meaningful image alt text, adequate contrast, and responsive layouts. Display prices from Medusa in INR.

Every data-driven screen must deliberately handle loading, empty, error, retry, available, and sold/unavailable states. A sold artwork stays visible with `SOLD`, “This original artwork has found its new home.”, and an optional “Request Similar Artwork” action. Label `pp_system_default` as “Cash on Delivery”; never expose provider IDs.

The vendor dashboard lives in the storefront account experience and uses the Gallery Quiet visual system. It must clearly distinguish awaiting review, publishing, published, and needs-changes states, and explain that submissions stay private until admin approval. Medusa Admin remains an internal operator tool and may use Medusa's native Admin visual system.
