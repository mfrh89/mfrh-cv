import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_hero_cta_link_type" AS ENUM('internal', 'external');
  CREATE TYPE "public"."enum_pages_blocks_hero_secondary_c_t_a_link_type" AS ENUM('internal', 'external');
  CREATE TYPE "public"."enum_pages_blocks_text_media_cta_link_type" AS ENUM('internal', 'external');
  CREATE TYPE "public"."enum_pages_blocks_quote_cta_link_type" AS ENUM('internal', 'external');
  CREATE TYPE "public"."enum__pages_v_blocks_hero_cta_link_type" AS ENUM('internal', 'external');
  CREATE TYPE "public"."enum__pages_v_blocks_hero_secondary_c_t_a_link_type" AS ENUM('internal', 'external');
  CREATE TYPE "public"."enum__pages_v_blocks_text_media_cta_link_type" AS ENUM('internal', 'external');
  CREATE TYPE "public"."enum__pages_v_blocks_quote_cta_link_type" AS ENUM('internal', 'external');
  CREATE TYPE "public"."enum_projects_links_link_type" AS ENUM('internal', 'external');
  CREATE TYPE "public"."enum__projects_v_version_links_link_type" AS ENUM('internal', 'external');
  ALTER TABLE "pages_blocks_hero" ADD COLUMN "cta_link_type" "enum_pages_blocks_hero_cta_link_type" DEFAULT 'external';
  ALTER TABLE "pages_blocks_hero" ADD COLUMN "cta_page_id" integer;
  ALTER TABLE "pages_blocks_hero" ADD COLUMN "secondary_c_t_a_link_type" "enum_pages_blocks_hero_secondary_c_t_a_link_type" DEFAULT 'external';
  ALTER TABLE "pages_blocks_hero" ADD COLUMN "secondary_c_t_a_page_id" integer;
  ALTER TABLE "pages_blocks_text_media" ADD COLUMN "cta_link_type" "enum_pages_blocks_text_media_cta_link_type" DEFAULT 'external';
  ALTER TABLE "pages_blocks_text_media" ADD COLUMN "cta_page_id" integer;
  ALTER TABLE "pages_blocks_quote" ADD COLUMN "cta_link_type" "enum_pages_blocks_quote_cta_link_type" DEFAULT 'external';
  ALTER TABLE "pages_blocks_quote" ADD COLUMN "cta_page_id" integer;
  ALTER TABLE "_pages_v_blocks_hero" ADD COLUMN "cta_link_type" "enum__pages_v_blocks_hero_cta_link_type" DEFAULT 'external';
  ALTER TABLE "_pages_v_blocks_hero" ADD COLUMN "cta_page_id" integer;
  ALTER TABLE "_pages_v_blocks_hero" ADD COLUMN "secondary_c_t_a_link_type" "enum__pages_v_blocks_hero_secondary_c_t_a_link_type" DEFAULT 'external';
  ALTER TABLE "_pages_v_blocks_hero" ADD COLUMN "secondary_c_t_a_page_id" integer;
  ALTER TABLE "_pages_v_blocks_text_media" ADD COLUMN "cta_link_type" "enum__pages_v_blocks_text_media_cta_link_type" DEFAULT 'external';
  ALTER TABLE "_pages_v_blocks_text_media" ADD COLUMN "cta_page_id" integer;
  ALTER TABLE "_pages_v_blocks_quote" ADD COLUMN "cta_link_type" "enum__pages_v_blocks_quote_cta_link_type" DEFAULT 'external';
  ALTER TABLE "_pages_v_blocks_quote" ADD COLUMN "cta_page_id" integer;
  ALTER TABLE "projects_links" ADD COLUMN "link_type" "enum_projects_links_link_type" DEFAULT 'external';
  ALTER TABLE "projects_links" ADD COLUMN "page_id" integer;
  ALTER TABLE "_projects_v_version_links" ADD COLUMN "link_type" "enum__projects_v_version_links_link_type" DEFAULT 'external';
  ALTER TABLE "_projects_v_version_links" ADD COLUMN "page_id" integer;
  ALTER TABLE "pages_blocks_hero" ADD CONSTRAINT "pages_blocks_hero_cta_page_id_pages_id_fk" FOREIGN KEY ("cta_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero" ADD CONSTRAINT "pages_blocks_hero_secondary_c_t_a_page_id_pages_id_fk" FOREIGN KEY ("secondary_c_t_a_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_text_media" ADD CONSTRAINT "pages_blocks_text_media_cta_page_id_pages_id_fk" FOREIGN KEY ("cta_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_quote" ADD CONSTRAINT "pages_blocks_quote_cta_page_id_pages_id_fk" FOREIGN KEY ("cta_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero" ADD CONSTRAINT "_pages_v_blocks_hero_cta_page_id_pages_id_fk" FOREIGN KEY ("cta_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero" ADD CONSTRAINT "_pages_v_blocks_hero_secondary_c_t_a_page_id_pages_id_fk" FOREIGN KEY ("secondary_c_t_a_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_text_media" ADD CONSTRAINT "_pages_v_blocks_text_media_cta_page_id_pages_id_fk" FOREIGN KEY ("cta_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_quote" ADD CONSTRAINT "_pages_v_blocks_quote_cta_page_id_pages_id_fk" FOREIGN KEY ("cta_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects_links" ADD CONSTRAINT "projects_links_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v_version_links" ADD CONSTRAINT "_projects_v_version_links_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "pages_blocks_hero_cta_cta_page_idx" ON "pages_blocks_hero" USING btree ("cta_page_id");
  CREATE INDEX "pages_blocks_hero_secondary_c_t_a_secondary_c_t_a_page_idx" ON "pages_blocks_hero" USING btree ("secondary_c_t_a_page_id");
  CREATE INDEX "pages_blocks_text_media_cta_cta_page_idx" ON "pages_blocks_text_media" USING btree ("cta_page_id");
  CREATE INDEX "pages_blocks_quote_cta_cta_page_idx" ON "pages_blocks_quote" USING btree ("cta_page_id");
  CREATE INDEX "_pages_v_blocks_hero_cta_cta_page_idx" ON "_pages_v_blocks_hero" USING btree ("cta_page_id");
  CREATE INDEX "_pages_v_blocks_hero_secondary_c_t_a_secondary_c_t_a_pag_idx" ON "_pages_v_blocks_hero" USING btree ("secondary_c_t_a_page_id");
  CREATE INDEX "_pages_v_blocks_text_media_cta_cta_page_idx" ON "_pages_v_blocks_text_media" USING btree ("cta_page_id");
  CREATE INDEX "_pages_v_blocks_quote_cta_cta_page_idx" ON "_pages_v_blocks_quote" USING btree ("cta_page_id");
  CREATE INDEX "projects_links_page_idx" ON "projects_links" USING btree ("page_id");
  CREATE INDEX "_projects_v_version_links_page_idx" ON "_projects_v_version_links" USING btree ("page_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_hero" DROP CONSTRAINT "pages_blocks_hero_cta_page_id_pages_id_fk";
  
  ALTER TABLE "pages_blocks_hero" DROP CONSTRAINT "pages_blocks_hero_secondary_c_t_a_page_id_pages_id_fk";
  
  ALTER TABLE "pages_blocks_text_media" DROP CONSTRAINT "pages_blocks_text_media_cta_page_id_pages_id_fk";
  
  ALTER TABLE "pages_blocks_quote" DROP CONSTRAINT "pages_blocks_quote_cta_page_id_pages_id_fk";
  
  ALTER TABLE "_pages_v_blocks_hero" DROP CONSTRAINT "_pages_v_blocks_hero_cta_page_id_pages_id_fk";
  
  ALTER TABLE "_pages_v_blocks_hero" DROP CONSTRAINT "_pages_v_blocks_hero_secondary_c_t_a_page_id_pages_id_fk";
  
  ALTER TABLE "_pages_v_blocks_text_media" DROP CONSTRAINT "_pages_v_blocks_text_media_cta_page_id_pages_id_fk";
  
  ALTER TABLE "_pages_v_blocks_quote" DROP CONSTRAINT "_pages_v_blocks_quote_cta_page_id_pages_id_fk";
  
  ALTER TABLE "projects_links" DROP CONSTRAINT "projects_links_page_id_pages_id_fk";
  
  ALTER TABLE "_projects_v_version_links" DROP CONSTRAINT "_projects_v_version_links_page_id_pages_id_fk";
  
  DROP INDEX "pages_blocks_hero_cta_cta_page_idx";
  DROP INDEX "pages_blocks_hero_secondary_c_t_a_secondary_c_t_a_page_idx";
  DROP INDEX "pages_blocks_text_media_cta_cta_page_idx";
  DROP INDEX "pages_blocks_quote_cta_cta_page_idx";
  DROP INDEX "_pages_v_blocks_hero_cta_cta_page_idx";
  DROP INDEX "_pages_v_blocks_hero_secondary_c_t_a_secondary_c_t_a_pag_idx";
  DROP INDEX "_pages_v_blocks_text_media_cta_cta_page_idx";
  DROP INDEX "_pages_v_blocks_quote_cta_cta_page_idx";
  DROP INDEX "projects_links_page_idx";
  DROP INDEX "_projects_v_version_links_page_idx";
  ALTER TABLE "pages_blocks_hero" DROP COLUMN "cta_link_type";
  ALTER TABLE "pages_blocks_hero" DROP COLUMN "cta_page_id";
  ALTER TABLE "pages_blocks_hero" DROP COLUMN "secondary_c_t_a_link_type";
  ALTER TABLE "pages_blocks_hero" DROP COLUMN "secondary_c_t_a_page_id";
  ALTER TABLE "pages_blocks_text_media" DROP COLUMN "cta_link_type";
  ALTER TABLE "pages_blocks_text_media" DROP COLUMN "cta_page_id";
  ALTER TABLE "pages_blocks_quote" DROP COLUMN "cta_link_type";
  ALTER TABLE "pages_blocks_quote" DROP COLUMN "cta_page_id";
  ALTER TABLE "_pages_v_blocks_hero" DROP COLUMN "cta_link_type";
  ALTER TABLE "_pages_v_blocks_hero" DROP COLUMN "cta_page_id";
  ALTER TABLE "_pages_v_blocks_hero" DROP COLUMN "secondary_c_t_a_link_type";
  ALTER TABLE "_pages_v_blocks_hero" DROP COLUMN "secondary_c_t_a_page_id";
  ALTER TABLE "_pages_v_blocks_text_media" DROP COLUMN "cta_link_type";
  ALTER TABLE "_pages_v_blocks_text_media" DROP COLUMN "cta_page_id";
  ALTER TABLE "_pages_v_blocks_quote" DROP COLUMN "cta_link_type";
  ALTER TABLE "_pages_v_blocks_quote" DROP COLUMN "cta_page_id";
  ALTER TABLE "projects_links" DROP COLUMN "link_type";
  ALTER TABLE "projects_links" DROP COLUMN "page_id";
  ALTER TABLE "_projects_v_version_links" DROP COLUMN "link_type";
  ALTER TABLE "_projects_v_version_links" DROP COLUMN "page_id";
  DROP TYPE "public"."enum_pages_blocks_hero_cta_link_type";
  DROP TYPE "public"."enum_pages_blocks_hero_secondary_c_t_a_link_type";
  DROP TYPE "public"."enum_pages_blocks_text_media_cta_link_type";
  DROP TYPE "public"."enum_pages_blocks_quote_cta_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_hero_cta_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_hero_secondary_c_t_a_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_text_media_cta_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_quote_cta_link_type";
  DROP TYPE "public"."enum_projects_links_link_type";
  DROP TYPE "public"."enum__projects_v_version_links_link_type";`)
}
