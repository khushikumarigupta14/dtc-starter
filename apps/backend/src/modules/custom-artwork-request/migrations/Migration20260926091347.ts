import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260926091347 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "custom_artwork_request" add column if not exists "internal_note" text null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "custom_artwork_request" drop column if exists "internal_note";`);
  }

}
