import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Button, Container, Heading, StatusBadge, Table, Text } from "@medusajs/ui"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

type RequestStatus =
  | "new"
  | "under_review"
  | "quote_sent"
  | "approved"
  | "rejected"
  | "cancelled"

type CustomArtworkRequest = {
  id: string
  full_name: string
  email: string
  phone: string | null
  artwork_type: string
  preferred_medium: string | null
  size: string | null
  orientation: string | null
  required_date: string | null
  instructions: string
  inspired_by_product_id: string | null
  status: RequestStatus
  internal_note: string | null
  created_at: string
}

type CustomArtworkRequestsResponse = {
  custom_artwork_requests: CustomArtworkRequest[]
  count: number
}

const statusLabels: Record<RequestStatus, string> = {
  new: "New",
  under_review: "Under review",
  quote_sent: "Quote sent",
  approved: "Approved",
  rejected: "Rejected",
  cancelled: "Cancelled",
}

const statusColors: Record<RequestStatus, "blue" | "orange" | "purple" | "green" | "red" | "grey"> = {
  new: "blue",
  under_review: "orange",
  quote_sent: "purple",
  approved: "green",
  rejected: "red",
  cancelled: "grey",
}

const nextStatuses: Record<RequestStatus, RequestStatus[]> = {
  new: ["under_review", "cancelled"],
  under_review: ["quote_sent", "rejected", "cancelled"],
  quote_sent: ["approved", "under_review", "rejected", "cancelled"],
  approved: ["under_review"],
  rejected: ["under_review"],
  cancelled: ["under_review"],
}

const formatDate = (value: string | null) => {
  if (!value) return "Not specified"

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
  }).format(new Date(value))
}

const fetchRequests = async (): Promise<CustomArtworkRequestsResponse> => {
  const response = await fetch("/admin/custom-artwork-requests", {
    credentials: "include",
    headers: { Accept: "application/json" },
  })

  if (!response.ok) {
    throw new Error("Could not load custom artwork requests")
  }

  return response.json()
}

const CustomArtworkRequestsPage = () => {
  const queryClient = useQueryClient()
  const { data, error, isLoading, refetch, isFetching } = useQuery({
    queryKey: ["custom-artwork-requests"],
    queryFn: fetchRequests,
  })
  const updateRequest = useMutation({
    mutationFn: async ({ id, status, internalNote }: { id: string; status?: RequestStatus; internalNote: string | null }) => {
      const response = await fetch(`/admin/custom-artwork-requests/${id}`, {
        method: "POST",
        credentials: "include",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({ status, internal_note: internalNote }),
      })
      if (!response.ok) {
        const body = await response.json().catch(() => null)
        throw new Error(body?.message ?? "Could not update the request")
      }
      return response.json()
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["custom-artwork-requests"] }),
  })

  const edit = (request: CustomArtworkRequest, status?: RequestStatus) => {
    const note = window.prompt("Internal note (visible only to Admin operators):", request.internal_note ?? "")
    if (note === null) return
    updateRequest.mutate({ id: request.id, status, internalNote: note.trim() || null })
  }

  const requests = data?.custom_artwork_requests ?? []

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <Heading level="h1">Custom artwork requests</Heading>
          <Text size="small" className="text-ui-fg-subtle">
            Review commission enquiries. Submissions are not orders or payments.
          </Text>
        </div>
        <Button variant="secondary" size="small" onClick={() => refetch()} disabled={isFetching}>
          Refresh
        </Button>
      </div>

      {updateRequest.error && (
        <div className="bg-ui-bg-subtle px-6 py-3" role="alert">
          <Text size="small" className="text-ui-fg-error">{updateRequest.error.message}</Text>
        </div>
      )}

      {isLoading ? (
        <div className="px-6 py-16 text-center"><Text className="text-ui-fg-subtle">Loading requests…</Text></div>
      ) : error ? (
        <div className="flex flex-col items-center gap-3 px-6 py-16 text-center" role="alert">
          <Text>{error instanceof Error ? error.message : "Could not load custom artwork requests"}</Text>
          <Button variant="secondary" size="small" onClick={() => refetch()}>Try again</Button>
        </div>
      ) : requests.length === 0 ? (
        <div className="px-6 py-16 text-center">
          <Heading level="h2">No requests yet</Heading>
          <Text size="small" className="mt-1 text-ui-fg-subtle">New storefront enquiries will appear here.</Text>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Customer</Table.HeaderCell>
                <Table.HeaderCell>Artwork</Table.HeaderCell>
                <Table.HeaderCell>Brief</Table.HeaderCell>
                <Table.HeaderCell>Required by</Table.HeaderCell>
                <Table.HeaderCell>Status</Table.HeaderCell>
                <Table.HeaderCell>Received</Table.HeaderCell>
                <Table.HeaderCell>Actions</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {requests.map((request) => (
                <Table.Row key={request.id}>
                  <Table.Cell>
                    <div className="flex max-w-56 flex-col">
                      <Text size="small" weight="plus">{request.full_name}</Text>
                      <a className="text-ui-fg-interactive text-ui-fg-subtle" href={`mailto:${request.email}`}>{request.email}</a>
                      {request.phone && <a className="text-ui-fg-subtle" href={`tel:${request.phone}`}>{request.phone}</a>}
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex max-w-44 flex-col">
                      <Text size="small">{request.artwork_type}</Text>
                      <Text size="xsmall" className="text-ui-fg-subtle">
                        {[request.preferred_medium, request.size, request.orientation].filter(Boolean).join(" · ") || "No preferences"}
                      </Text>
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <Text size="small" className="block max-w-80 whitespace-normal">{request.instructions}</Text>
                    {request.inspired_by_product_id && <Text size="xsmall" className="mt-1 text-ui-fg-subtle">Inspired by: {request.inspired_by_product_id}</Text>}
                  </Table.Cell>
                  <Table.Cell>{formatDate(request.required_date)}</Table.Cell>
                  <Table.Cell>
                    <StatusBadge color={statusColors[request.status]}>{statusLabels[request.status]}</StatusBadge>
                    {request.internal_note && <Text size="xsmall" className="mt-1 block max-w-56 whitespace-normal text-ui-fg-subtle">Note: {request.internal_note}</Text>}
                  </Table.Cell>
                  <Table.Cell>{formatDate(request.created_at)}</Table.Cell>
                  <Table.Cell>
                    <div className="flex max-w-72 flex-wrap gap-2">
                      {nextStatuses[request.status].map((status) => (
                        <Button key={status} size="small" variant="secondary" onClick={() => edit(request, status)} disabled={updateRequest.isPending}>
                          {statusLabels[status]}
                        </Button>
                      ))}
                      <Button size="small" variant="transparent" onClick={() => edit(request)} disabled={updateRequest.isPending}>Edit note</Button>
                    </div>
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
  label: "Custom artwork",
})

export default CustomArtworkRequestsPage
