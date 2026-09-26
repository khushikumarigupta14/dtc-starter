import { Migration } from "@medusajs/framework/mikro-orm/migrations"

export class Migration20260921150000 extends Migration {
  override async up(): Promise<void> {
    this.addSql(`create table if not exists "vendor_product_submission" ("id" text not null, "vendor_customer_id" text not null, "vendor_name" text not null, "vendor_email" text not null, "title" text not null, "description" text not null, "medium" text not null, "dimensions" text not null, "price" numeric not null, "quantity" integer not null default 1, "image_url" text null, "status" text check ("status" in ('pending', 'processing', 'approved', 'rejected')) not null default 'pending', "product_id" text null, "review_note" text null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "vendor_product_submission_pkey" primary key ("id"));`)
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_vendor_product_submission_vendor" ON "vendor_product_submission" ("vendor_customer_id") WHERE deleted_at IS NULL;`)
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_vendor_product_submission_status" ON "vendor_product_submission" ("status") WHERE deleted_at IS NULL;`)
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "vendor_product_submission" cascade;`)
  }
}
