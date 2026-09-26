import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Button, Container, Heading, StatusBadge, Table, Text } from "@medusajs/ui"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

type Status = "pending" | "processing" | "approved" | "rejected"
type VendorProduct = {
  id: string
  vendor_name: string
  vendor_email: string
  title: string
  description: string
  medium: string
  dimensions: string
  price: number
  quantity: number
  image_url: string | null
  status: Status
  product_id: string | null
  review_note: string | null
  created_at: string
}

const statusColor: Record<Status, "orange" | "blue" | "green" | "red"> = {
  pending: "orange",
  processing: "blue",
  approved: "green",
  rejected: "red",
}

const money = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 })
const date = new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" })

async function request(path: string, init?: RequestInit) {
  const response = await fetch(path, {
    credentials: "include",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    ...init,
  })
  if (!response.ok) {
    const body = await response.json().catch(() => null)
    throw new Error(body?.message ?? "The request could not be completed")
  }
  return response.json()
}

const VendorProductsPage = () => {
  const queryClient = useQueryClient()
  const products = useQuery<{ vendor_products: VendorProduct[] }>({
    queryKey: ["vendor-products"],
    queryFn: () => request("/admin/vendor-products"),
  })
  const action = useMutation({
    mutationFn: ({ id, kind, note }: { id: string; kind: "approve" | "reject"; note?: string }) =>
      request(`/admin/vendor-products/${id}/${kind}`, {
        method: "POST",
        body: JSON.stringify(kind === "reject" ? { note } : {}),
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["vendor-products"] }),
  })

  const reject = (id: string) => {
    const note = window.prompt("Tell the vendor what needs to change:")
    if (note?.trim()) action.mutate({ id, kind: "reject", note: note.trim() })
  }

  const rows = products.data?.vendor_products ?? []

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <Heading level="h1">Vendor artwork review</Heading>
          <Text size="small" className="text-ui-fg-subtle">
            Approving publishes the artwork with its INR price and submitted inventory.
          </Text>
        </div>
        <Button variant="secondary" size="small" onClick={() => products.refetch()} disabled={products.isFetching}>
          Refresh
        </Button>
      </div>

      {action.error && (
        <div className="bg-ui-bg-subtle px-6 py-3" role="alert">
          <Text size="small" className="text-ui-fg-error">{action.error.message}</Text>
        </div>
      )}

      {products.isLoading ? (
        <div className="px-6 py-16 text-center"><Text className="text-ui-fg-subtle">Loading submissions…</Text></div>
      ) : products.error ? (
        <div className="flex flex-col items-center gap-3 px-6 py-16 text-center" role="alert">
          <Text>{products.error.message}</Text>
          <Button variant="secondary" size="small" onClick={() => products.refetch()}>Try again</Button>
        </div>
      ) : rows.length === 0 ? (
        <div className="px-6 py-16 text-center">
          <Heading level="h2">No vendor submissions</Heading>
          <Text size="small" className="mt-1 text-ui-fg-subtle">New artwork from vendor dashboards will appear here.</Text>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Artwork</Table.HeaderCell>
                <Table.HeaderCell>Vendor</Table.HeaderCell>
                <Table.HeaderCell>Price / stock</Table.HeaderCell>
                <Table.HeaderCell>Status</Table.HeaderCell>
                <Table.HeaderCell>Submitted</Table.HeaderCell>
                <Table.HeaderCell>Actions</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {rows.map((item) => (
                <Table.Row key={item.id}>
                  <Table.Cell>
                    <div className="flex max-w-80 gap-3">
                      {item.image_url && <img src={item.image_url} alt="" className="h-14 w-14 rounded object-cover" />}
                      <div>
                        <Text size="small" weight="plus">{item.title}</Text>
                        <Text size="xsmall" className="text-ui-fg-subtle">{item.medium} · {item.dimensions}</Text>
                        <Text size="xsmall" className="mt-1 line-clamp-2 text-ui-fg-subtle">{item.description}</Text>
                        {item.review_note && <Text size="xsmall" className="mt-1 text-ui-fg-error">Note: {item.review_note}</Text>}
                      </div>
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <Text size="small">{item.vendor_name}</Text>
                    <a href={`mailto:${item.vendor_email}`} className="text-ui-fg-interactive text-ui-fg-subtle">{item.vendor_email}</a>
                  </Table.Cell>
                  <Table.Cell>
                    <Text size="small">{money.format(item.price)}</Text>
                    <Text size="xsmall" className="text-ui-fg-subtle">{item.quantity} available</Text>
                  </Table.Cell>
                  <Table.Cell><StatusBadge color={statusColor[item.status]}>{item.status}</StatusBadge></Table.Cell>
                  <Table.Cell>{date.format(new Date(item.created_at))}</Table.Cell>
                  <Table.Cell>
                    {item.status === "pending" ? (
                      <div className="flex gap-2">
                        <Button size="small" onClick={() => action.mutate({ id: item.id, kind: "approve" })} disabled={action.isPending}>Approve</Button>
                        <Button size="small" variant="secondary" onClick={() => reject(item.id)} disabled={action.isPending}>Reject</Button>
                      </div>
                    ) : item.product_id ? (
                      <a className="text-ui-fg-interactive" href={`/app/products/${item.product_id}`}>Open product</a>
                    ) : null}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      )}
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Vendor review",
})

export default VendorProductsPage
