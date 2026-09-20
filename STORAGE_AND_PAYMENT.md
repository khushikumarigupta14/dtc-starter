# Storage and Payment

Medusa's Local File Provider is the development storage provider and serves uploaded assets through the backend. Always upload through the File Module; never make product logic depend on disk paths. Production migration to an S3-compatible provider is a future task.

The India region enables only Medusa's system payment provider (`pp_system_default`), presented to customers as “Cash on Delivery.” It performs no external payment processing. An order may be placed while payment remains uncollected until delivery.
