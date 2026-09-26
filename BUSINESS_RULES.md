# Business Rules

Original artwork generally has sellable quantity `1`, while future prints may have more. Inventory must come from variant configuration, not hard-coded frontend assumptions.

At zero sellable inventory, prevent purchase/add-to-cart, show `SOLD`, keep a published artwork visible for portfolio value, and optionally show “Request Similar Artwork.” Never automatically delete or unpublish it.

Medusa is authoritative for INR prices and cart totals. Only purchasable variants may be added and quantities must respect inventory.

Checkout collects contact and shipping details, a shipping method, COD selection, then creates and confirms the order. It must not collect card/UPI details, invent a transaction ID, or state that payment succeeded. Payment is due/collected on delivery.

Custom artwork submissions are enquiries. A source sold artwork may be referenced but must not be silently added to cart. Product images go through Medusa file functionality; browser code never depends on filesystem paths. Prefer Medusa Admin for routine operations.

Vendor artwork submissions belong to the authenticated customer that created them. They are not catalog products and must not appear on the storefront until an authenticated admin approves them. Approval creates the Medusa product, INR price, sales-channel assignment, and inventory level. Rejection must preserve the submission and expose an operator note to its vendor.
