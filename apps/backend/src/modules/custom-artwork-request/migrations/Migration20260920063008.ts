import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260920063008 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "custom_artwork_request" ("id" text not null, "full_name" text not null, "email" text not null, "phone" text null, "artwork_type" text not null, "preferred_medium" text null, "size" text null, "orientation" text null, "required_date" timestamptz null, "instructions" text not null, "inspired_by_product_id" text null, "status" text check ("status" in ('new', 'under_review', 'quote_sent', 'approved', 'rejected', 'cancelled')) not null default 'new', "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "custom_artwork_request_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_custom_artwork_request_deleted_at" ON "custom_artwork_request" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "custom_artwork_request" cascade;`);
  }

}
