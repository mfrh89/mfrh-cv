import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Fully idempotent: safe to re-run after partial failure

  // 1. Drop old foreign keys
  await db.execute(sql`
    ALTER TABLE "pages_blocks_hero" DROP CONSTRAINT IF EXISTS "pages_blocks_hero_cta_page_id_pages_id_fk";
    ALTER TABLE "pages_blocks_hero" DROP CONSTRAINT IF EXISTS "pages_blocks_hero_secondary_c_t_a_page_id_pages_id_fk";
    ALTER TABLE "pages_blocks_text_media" DROP CONSTRAINT IF EXISTS "pages_blocks_text_media_cta_page_id_pages_id_fk";
    ALTER TABLE "pages_blocks_quote" DROP CONSTRAINT IF EXISTS "pages_blocks_quote_cta_page_id_pages_id_fk";
    ALTER TABLE "_pages_v_blocks_hero" DROP CONSTRAINT IF EXISTS "_pages_v_blocks_hero_cta_page_id_pages_id_fk";
    ALTER TABLE "_pages_v_blocks_hero" DROP CONSTRAINT IF EXISTS "_pages_v_blocks_hero_secondary_c_t_a_page_id_pages_id_fk";
    ALTER TABLE "_pages_v_blocks_text_media" DROP CONSTRAINT IF EXISTS "_pages_v_blocks_text_media_cta_page_id_pages_id_fk";
    ALTER TABLE "_pages_v_blocks_quote" DROP CONSTRAINT IF EXISTS "_pages_v_blocks_quote_cta_page_id_pages_id_fk";
    ALTER TABLE "projects_links" DROP CONSTRAINT IF EXISTS "projects_links_page_id_pages_id_fk";
    ALTER TABLE "_projects_v_version_links" DROP CONSTRAINT IF EXISTS "_projects_v_version_links_page_id_pages_id_fk";
    ALTER TABLE "site_settings_footer_links" DROP CONSTRAINT IF EXISTS "site_settings_footer_links_page_id_pages_id_fk";
  `)

  // 2. Drop old indexes
  await db.execute(sql`
    DROP INDEX IF EXISTS "pages_blocks_hero_cta_cta_page_idx";
    DROP INDEX IF EXISTS "pages_blocks_hero_secondary_c_t_a_secondary_c_t_a_page_idx";
    DROP INDEX IF EXISTS "pages_blocks_text_media_cta_cta_page_idx";
    DROP INDEX IF EXISTS "pages_blocks_quote_cta_cta_page_idx";
    DROP INDEX IF EXISTS "_pages_v_blocks_hero_cta_cta_page_idx";
    DROP INDEX IF EXISTS "_pages_v_blocks_hero_secondary_c_t_a_secondary_c_t_a_pag_idx";
    DROP INDEX IF EXISTS "_pages_v_blocks_text_media_cta_cta_page_idx";
    DROP INDEX IF EXISTS "_pages_v_blocks_quote_cta_cta_page_idx";
    DROP INDEX IF EXISTS "projects_links_page_idx";
    DROP INDEX IF EXISTS "_projects_v_version_links_page_idx";
    DROP INDEX IF EXISTS "site_settings_footer_links_page_idx";
  `)

  // 3. Drop old columns
  await db.execute(sql`
    ALTER TABLE "pages_blocks_hero" DROP COLUMN IF EXISTS "cta_link_type";
    ALTER TABLE "pages_blocks_hero" DROP COLUMN IF EXISTS "cta_page_id";
    ALTER TABLE "pages_blocks_hero" DROP COLUMN IF EXISTS "secondary_c_t_a_link_type";
    ALTER TABLE "pages_blocks_hero" DROP COLUMN IF EXISTS "secondary_c_t_a_page_id";
    ALTER TABLE "pages_blocks_text_media" DROP COLUMN IF EXISTS "cta_link_type";
    ALTER TABLE "pages_blocks_text_media" DROP COLUMN IF EXISTS "cta_page_id";
    ALTER TABLE "pages_blocks_quote" DROP COLUMN IF EXISTS "cta_link_type";
    ALTER TABLE "pages_blocks_quote" DROP COLUMN IF EXISTS "cta_page_id";
    ALTER TABLE "_pages_v_blocks_hero" DROP COLUMN IF EXISTS "cta_link_type";
    ALTER TABLE "_pages_v_blocks_hero" DROP COLUMN IF EXISTS "cta_page_id";
    ALTER TABLE "_pages_v_blocks_hero" DROP COLUMN IF EXISTS "secondary_c_t_a_link_type";
    ALTER TABLE "_pages_v_blocks_hero" DROP COLUMN IF EXISTS "secondary_c_t_a_page_id";
    ALTER TABLE "_pages_v_blocks_text_media" DROP COLUMN IF EXISTS "cta_link_type";
    ALTER TABLE "_pages_v_blocks_text_media" DROP COLUMN IF EXISTS "cta_page_id";
    ALTER TABLE "_pages_v_blocks_quote" DROP COLUMN IF EXISTS "cta_link_type";
    ALTER TABLE "_pages_v_blocks_quote" DROP COLUMN IF EXISTS "cta_page_id";
    ALTER TABLE "projects_links" DROP COLUMN IF EXISTS "link_type";
    ALTER TABLE "projects_links" DROP COLUMN IF EXISTS "page_id";
    ALTER TABLE "_projects_v_version_links" DROP COLUMN IF EXISTS "link_type";
    ALTER TABLE "_projects_v_version_links" DROP COLUMN IF EXISTS "page_id";
    ALTER TABLE "site_settings_footer_links" DROP COLUMN IF EXISTS "page_id";
  `)

  // 4. Drop old enums and old type column on footer_links
  await db.execute(sql`
    ALTER TABLE "site_settings_footer_links" DROP COLUMN IF EXISTS "type";
    DROP TYPE IF EXISTS "public"."enum_pages_blocks_hero_cta_link_type";
    DROP TYPE IF EXISTS "public"."enum_pages_blocks_hero_secondary_c_t_a_link_type";
    DROP TYPE IF EXISTS "public"."enum_pages_blocks_text_media_cta_link_type";
    DROP TYPE IF EXISTS "public"."enum_pages_blocks_quote_cta_link_type";
    DROP TYPE IF EXISTS "public"."enum__pages_v_blocks_hero_cta_link_type";
    DROP TYPE IF EXISTS "public"."enum__pages_v_blocks_hero_secondary_c_t_a_link_type";
    DROP TYPE IF EXISTS "public"."enum__pages_v_blocks_text_media_cta_link_type";
    DROP TYPE IF EXISTS "public"."enum__pages_v_blocks_quote_cta_link_type";
    DROP TYPE IF EXISTS "public"."enum_projects_links_link_type";
    DROP TYPE IF EXISTS "public"."enum__projects_v_version_links_link_type";
    DROP TYPE IF EXISTS "public"."enum_site_settings_footer_links_type";
  `)

  // 5. Create new enums (idempotent via DO blocks)
  await db.execute(sql`
    DO $$ BEGIN CREATE TYPE "public"."enum_pages_blocks_hero_cta_type" AS ENUM('route', 'internal', 'external'); EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN CREATE TYPE "public"."enum_pages_blocks_hero_secondary_c_t_a_type" AS ENUM('route', 'internal', 'external'); EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN CREATE TYPE "public"."enum_pages_blocks_text_media_cta_type" AS ENUM('route', 'internal', 'external'); EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN CREATE TYPE "public"."enum_pages_blocks_quote_cta_type" AS ENUM('route', 'internal', 'external'); EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN CREATE TYPE "public"."enum__pages_v_blocks_hero_cta_type" AS ENUM('route', 'internal', 'external'); EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN CREATE TYPE "public"."enum__pages_v_blocks_hero_secondary_c_t_a_type" AS ENUM('route', 'internal', 'external'); EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN CREATE TYPE "public"."enum__pages_v_blocks_text_media_cta_type" AS ENUM('route', 'internal', 'external'); EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN CREATE TYPE "public"."enum__pages_v_blocks_quote_cta_type" AS ENUM('route', 'internal', 'external'); EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN CREATE TYPE "public"."enum_projects_links_type" AS ENUM('route', 'internal', 'external'); EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN CREATE TYPE "public"."enum__projects_v_version_links_type" AS ENUM('route', 'internal', 'external'); EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN CREATE TYPE "public"."enum_site_settings_nav_links_type" AS ENUM('route', 'internal', 'external'); EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN CREATE TYPE "public"."enum_site_settings_footer_links_type" AS ENUM('route', 'internal', 'external'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  `)

  // 6. Create new route enums
  await db.execute(sql`
    DO $$ BEGIN CREATE TYPE "public"."enum_pages_blocks_hero_cta_route" AS ENUM('/cv', '/projects'); EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN CREATE TYPE "public"."enum_pages_blocks_hero_secondary_c_t_a_route" AS ENUM('/cv', '/projects'); EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN CREATE TYPE "public"."enum_pages_blocks_text_media_cta_route" AS ENUM('/cv', '/projects'); EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN CREATE TYPE "public"."enum_pages_blocks_quote_cta_route" AS ENUM('/cv', '/projects'); EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN CREATE TYPE "public"."enum__pages_v_blocks_hero_cta_route" AS ENUM('/cv', '/projects'); EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN CREATE TYPE "public"."enum__pages_v_blocks_hero_secondary_c_t_a_route" AS ENUM('/cv', '/projects'); EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN CREATE TYPE "public"."enum__pages_v_blocks_text_media_cta_route" AS ENUM('/cv', '/projects'); EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN CREATE TYPE "public"."enum__pages_v_blocks_quote_cta_route" AS ENUM('/cv', '/projects'); EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN CREATE TYPE "public"."enum_projects_links_route" AS ENUM('/cv', '/projects'); EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN CREATE TYPE "public"."enum__projects_v_version_links_route" AS ENUM('/cv', '/projects'); EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN CREATE TYPE "public"."enum_site_settings_nav_links_route" AS ENUM('/cv', '/projects'); EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN CREATE TYPE "public"."enum_site_settings_footer_links_route" AS ENUM('/cv', '/projects'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  `)

  // 7. Add new columns to page blocks (IF NOT EXISTS)
  await db.execute(sql`
    ALTER TABLE "pages_blocks_hero" ADD COLUMN IF NOT EXISTS "cta_type" "enum_pages_blocks_hero_cta_type" DEFAULT 'route';
    ALTER TABLE "pages_blocks_hero" ADD COLUMN IF NOT EXISTS "cta_route" "enum_pages_blocks_hero_cta_route";
    ALTER TABLE "pages_blocks_hero" ADD COLUMN IF NOT EXISTS "cta_url" varchar;
    ALTER TABLE "pages_blocks_hero" ADD COLUMN IF NOT EXISTS "secondary_c_t_a_type" "enum_pages_blocks_hero_secondary_c_t_a_type" DEFAULT 'route';
    ALTER TABLE "pages_blocks_hero" ADD COLUMN IF NOT EXISTS "secondary_c_t_a_route" "enum_pages_blocks_hero_secondary_c_t_a_route";
    ALTER TABLE "pages_blocks_hero" ADD COLUMN IF NOT EXISTS "secondary_c_t_a_url" varchar;

    ALTER TABLE "pages_blocks_text_media" ADD COLUMN IF NOT EXISTS "cta_type" "enum_pages_blocks_text_media_cta_type" DEFAULT 'route';
    ALTER TABLE "pages_blocks_text_media" ADD COLUMN IF NOT EXISTS "cta_route" "enum_pages_blocks_text_media_cta_route";
    ALTER TABLE "pages_blocks_text_media" ADD COLUMN IF NOT EXISTS "cta_url" varchar;

    ALTER TABLE "pages_blocks_quote" ADD COLUMN IF NOT EXISTS "cta_type" "enum_pages_blocks_quote_cta_type" DEFAULT 'route';
    ALTER TABLE "pages_blocks_quote" ADD COLUMN IF NOT EXISTS "cta_route" "enum_pages_blocks_quote_cta_route";
    ALTER TABLE "pages_blocks_quote" ADD COLUMN IF NOT EXISTS "cta_url" varchar;
  `)

  // 8. Add new columns to versioned page blocks
  await db.execute(sql`
    ALTER TABLE "_pages_v_blocks_hero" ADD COLUMN IF NOT EXISTS "cta_type" "enum__pages_v_blocks_hero_cta_type" DEFAULT 'route';
    ALTER TABLE "_pages_v_blocks_hero" ADD COLUMN IF NOT EXISTS "cta_route" "enum__pages_v_blocks_hero_cta_route";
    ALTER TABLE "_pages_v_blocks_hero" ADD COLUMN IF NOT EXISTS "cta_url" varchar;
    ALTER TABLE "_pages_v_blocks_hero" ADD COLUMN IF NOT EXISTS "secondary_c_t_a_type" "enum__pages_v_blocks_hero_secondary_c_t_a_type" DEFAULT 'route';
    ALTER TABLE "_pages_v_blocks_hero" ADD COLUMN IF NOT EXISTS "secondary_c_t_a_route" "enum__pages_v_blocks_hero_secondary_c_t_a_route";
    ALTER TABLE "_pages_v_blocks_hero" ADD COLUMN IF NOT EXISTS "secondary_c_t_a_url" varchar;

    ALTER TABLE "_pages_v_blocks_text_media" ADD COLUMN IF NOT EXISTS "cta_type" "enum__pages_v_blocks_text_media_cta_type" DEFAULT 'route';
    ALTER TABLE "_pages_v_blocks_text_media" ADD COLUMN IF NOT EXISTS "cta_route" "enum__pages_v_blocks_text_media_cta_route";
    ALTER TABLE "_pages_v_blocks_text_media" ADD COLUMN IF NOT EXISTS "cta_url" varchar;

    ALTER TABLE "_pages_v_blocks_quote" ADD COLUMN IF NOT EXISTS "cta_type" "enum__pages_v_blocks_quote_cta_type" DEFAULT 'route';
    ALTER TABLE "_pages_v_blocks_quote" ADD COLUMN IF NOT EXISTS "cta_route" "enum__pages_v_blocks_quote_cta_route";
    ALTER TABLE "_pages_v_blocks_quote" ADD COLUMN IF NOT EXISTS "cta_url" varchar;
  `)

  // 9. Add new columns to projects_links (url already exists from init schema)
  await db.execute(sql`
    ALTER TABLE "projects_links" ADD COLUMN IF NOT EXISTS "type" "enum_projects_links_type" DEFAULT 'route';
    ALTER TABLE "projects_links" ADD COLUMN IF NOT EXISTS "route" "enum_projects_links_route";

    ALTER TABLE "_projects_v_version_links" ADD COLUMN IF NOT EXISTS "type" "enum__projects_v_version_links_type" DEFAULT 'route';
    ALTER TABLE "_projects_v_version_links" ADD COLUMN IF NOT EXISTS "route" "enum__projects_v_version_links_route";
  `)

  // 10. Add new columns to site_settings_footer_links (url already exists)
  await db.execute(sql`
    ALTER TABLE "site_settings_footer_links" ADD COLUMN IF NOT EXISTS "type" "enum_site_settings_footer_links_type" DEFAULT 'route';
    ALTER TABLE "site_settings_footer_links" ADD COLUMN IF NOT EXISTS "route" "enum_site_settings_footer_links_route";
  `)

  // 11. Create site_settings_nav_links table
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "site_settings_nav_links" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "label" varchar NOT NULL,
      "type" "enum_site_settings_nav_links_type" DEFAULT 'route',
      "route" "enum_site_settings_nav_links_route",
      "url" varchar
    );
    DO $$ BEGIN
      ALTER TABLE "site_settings_nav_links" ADD CONSTRAINT "site_settings_nav_links_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;
    CREATE INDEX IF NOT EXISTS "site_settings_nav_links_order_idx" ON "site_settings_nav_links" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "site_settings_nav_links_parent_id_idx" ON "site_settings_nav_links" USING btree ("_parent_id");
  `)

  // 12. Create site_settings_rels table
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "site_settings_rels" (
      "id" serial PRIMARY KEY NOT NULL,
      "order" integer,
      "parent_id" integer NOT NULL,
      "path" varchar NOT NULL,
      "pages_id" integer,
      "projects_id" integer
    );
    DO $$ BEGIN
      ALTER TABLE "site_settings_rels" ADD CONSTRAINT "site_settings_rels_parent_fk"
        FOREIGN KEY ("parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN
      ALTER TABLE "site_settings_rels" ADD CONSTRAINT "site_settings_rels_pages_fk"
        FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN
      ALTER TABLE "site_settings_rels" ADD CONSTRAINT "site_settings_rels_projects_fk"
        FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;
    CREATE INDEX IF NOT EXISTS "site_settings_rels_order_idx" ON "site_settings_rels" USING btree ("order");
    CREATE INDEX IF NOT EXISTS "site_settings_rels_parent_idx" ON "site_settings_rels" USING btree ("parent_id");
    CREATE INDEX IF NOT EXISTS "site_settings_rels_path_idx" ON "site_settings_rels" USING btree ("path");
    CREATE INDEX IF NOT EXISTS "site_settings_rels_pages_id_idx" ON "site_settings_rels" USING btree ("pages_id");
    CREATE INDEX IF NOT EXISTS "site_settings_rels_projects_id_idx" ON "site_settings_rels" USING btree ("projects_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "site_settings_rels" CASCADE;
    DROP TABLE IF EXISTS "site_settings_nav_links" CASCADE;
  `)

  await db.execute(sql`
    ALTER TABLE "pages_blocks_hero" DROP COLUMN IF EXISTS "cta_type";
    ALTER TABLE "pages_blocks_hero" DROP COLUMN IF EXISTS "cta_route";
    ALTER TABLE "pages_blocks_hero" DROP COLUMN IF EXISTS "cta_url";
    ALTER TABLE "pages_blocks_hero" DROP COLUMN IF EXISTS "secondary_c_t_a_type";
    ALTER TABLE "pages_blocks_hero" DROP COLUMN IF EXISTS "secondary_c_t_a_route";
    ALTER TABLE "pages_blocks_hero" DROP COLUMN IF EXISTS "secondary_c_t_a_url";
    ALTER TABLE "pages_blocks_text_media" DROP COLUMN IF EXISTS "cta_type";
    ALTER TABLE "pages_blocks_text_media" DROP COLUMN IF EXISTS "cta_route";
    ALTER TABLE "pages_blocks_text_media" DROP COLUMN IF EXISTS "cta_url";
    ALTER TABLE "pages_blocks_quote" DROP COLUMN IF EXISTS "cta_type";
    ALTER TABLE "pages_blocks_quote" DROP COLUMN IF EXISTS "cta_route";
    ALTER TABLE "pages_blocks_quote" DROP COLUMN IF EXISTS "cta_url";
    ALTER TABLE "_pages_v_blocks_hero" DROP COLUMN IF EXISTS "cta_type";
    ALTER TABLE "_pages_v_blocks_hero" DROP COLUMN IF EXISTS "cta_route";
    ALTER TABLE "_pages_v_blocks_hero" DROP COLUMN IF EXISTS "cta_url";
    ALTER TABLE "_pages_v_blocks_hero" DROP COLUMN IF EXISTS "secondary_c_t_a_type";
    ALTER TABLE "_pages_v_blocks_hero" DROP COLUMN IF EXISTS "secondary_c_t_a_route";
    ALTER TABLE "_pages_v_blocks_hero" DROP COLUMN IF EXISTS "secondary_c_t_a_url";
    ALTER TABLE "_pages_v_blocks_text_media" DROP COLUMN IF EXISTS "cta_type";
    ALTER TABLE "_pages_v_blocks_text_media" DROP COLUMN IF EXISTS "cta_route";
    ALTER TABLE "_pages_v_blocks_text_media" DROP COLUMN IF EXISTS "cta_url";
    ALTER TABLE "_pages_v_blocks_quote" DROP COLUMN IF EXISTS "cta_type";
    ALTER TABLE "_pages_v_blocks_quote" DROP COLUMN IF EXISTS "cta_route";
    ALTER TABLE "_pages_v_blocks_quote" DROP COLUMN IF EXISTS "cta_url";
    ALTER TABLE "projects_links" DROP COLUMN IF EXISTS "type";
    ALTER TABLE "projects_links" DROP COLUMN IF EXISTS "route";
    ALTER TABLE "_projects_v_version_links" DROP COLUMN IF EXISTS "type";
    ALTER TABLE "_projects_v_version_links" DROP COLUMN IF EXISTS "route";
    ALTER TABLE "site_settings_footer_links" DROP COLUMN IF EXISTS "type";
    ALTER TABLE "site_settings_footer_links" DROP COLUMN IF EXISTS "route";
  `)

  await db.execute(sql`
    DROP TYPE IF EXISTS "public"."enum_pages_blocks_hero_cta_type";
    DROP TYPE IF EXISTS "public"."enum_pages_blocks_hero_cta_route";
    DROP TYPE IF EXISTS "public"."enum_pages_blocks_hero_secondary_c_t_a_type";
    DROP TYPE IF EXISTS "public"."enum_pages_blocks_hero_secondary_c_t_a_route";
    DROP TYPE IF EXISTS "public"."enum_pages_blocks_text_media_cta_type";
    DROP TYPE IF EXISTS "public"."enum_pages_blocks_text_media_cta_route";
    DROP TYPE IF EXISTS "public"."enum_pages_blocks_quote_cta_type";
    DROP TYPE IF EXISTS "public"."enum_pages_blocks_quote_cta_route";
    DROP TYPE IF EXISTS "public"."enum__pages_v_blocks_hero_cta_type";
    DROP TYPE IF EXISTS "public"."enum__pages_v_blocks_hero_cta_route";
    DROP TYPE IF EXISTS "public"."enum__pages_v_blocks_hero_secondary_c_t_a_type";
    DROP TYPE IF EXISTS "public"."enum__pages_v_blocks_hero_secondary_c_t_a_route";
    DROP TYPE IF EXISTS "public"."enum__pages_v_blocks_text_media_cta_type";
    DROP TYPE IF EXISTS "public"."enum__pages_v_blocks_text_media_cta_route";
    DROP TYPE IF EXISTS "public"."enum__pages_v_blocks_quote_cta_type";
    DROP TYPE IF EXISTS "public"."enum__pages_v_blocks_quote_cta_route";
    DROP TYPE IF EXISTS "public"."enum_projects_links_type";
    DROP TYPE IF EXISTS "public"."enum_projects_links_route";
    DROP TYPE IF EXISTS "public"."enum__projects_v_version_links_type";
    DROP TYPE IF EXISTS "public"."enum__projects_v_version_links_route";
    DROP TYPE IF EXISTS "public"."enum_site_settings_nav_links_type";
    DROP TYPE IF EXISTS "public"."enum_site_settings_nav_links_route";
    DROP TYPE IF EXISTS "public"."enum_site_settings_footer_links_type";
    DROP TYPE IF EXISTS "public"."enum_site_settings_footer_links_route";
  `)

  await db.execute(sql`
    DO $$ BEGIN CREATE TYPE "public"."enum_pages_blocks_hero_cta_link_type" AS ENUM('internal', 'external'); EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN CREATE TYPE "public"."enum_pages_blocks_hero_secondary_c_t_a_link_type" AS ENUM('internal', 'external'); EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN CREATE TYPE "public"."enum_pages_blocks_text_media_cta_link_type" AS ENUM('internal', 'external'); EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN CREATE TYPE "public"."enum_pages_blocks_quote_cta_link_type" AS ENUM('internal', 'external'); EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN CREATE TYPE "public"."enum__pages_v_blocks_hero_cta_link_type" AS ENUM('internal', 'external'); EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN CREATE TYPE "public"."enum__pages_v_blocks_hero_secondary_c_t_a_link_type" AS ENUM('internal', 'external'); EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN CREATE TYPE "public"."enum__pages_v_blocks_text_media_cta_link_type" AS ENUM('internal', 'external'); EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN CREATE TYPE "public"."enum__pages_v_blocks_quote_cta_link_type" AS ENUM('internal', 'external'); EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN CREATE TYPE "public"."enum_projects_links_link_type" AS ENUM('internal', 'external'); EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN CREATE TYPE "public"."enum__projects_v_version_links_link_type" AS ENUM('internal', 'external'); EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN CREATE TYPE "public"."enum_site_settings_footer_links_type" AS ENUM('internal', 'external'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  `)

  await db.execute(sql`
    ALTER TABLE "pages_blocks_hero" ADD COLUMN IF NOT EXISTS "cta_link_type" "enum_pages_blocks_hero_cta_link_type" DEFAULT 'external';
    ALTER TABLE "pages_blocks_hero" ADD COLUMN IF NOT EXISTS "cta_page_id" integer;
    ALTER TABLE "pages_blocks_hero" ADD COLUMN IF NOT EXISTS "secondary_c_t_a_link_type" "enum_pages_blocks_hero_secondary_c_t_a_link_type" DEFAULT 'external';
    ALTER TABLE "pages_blocks_hero" ADD COLUMN IF NOT EXISTS "secondary_c_t_a_page_id" integer;
    ALTER TABLE "pages_blocks_text_media" ADD COLUMN IF NOT EXISTS "cta_link_type" "enum_pages_blocks_text_media_cta_link_type" DEFAULT 'external';
    ALTER TABLE "pages_blocks_text_media" ADD COLUMN IF NOT EXISTS "cta_page_id" integer;
    ALTER TABLE "pages_blocks_quote" ADD COLUMN IF NOT EXISTS "cta_link_type" "enum_pages_blocks_quote_cta_link_type" DEFAULT 'external';
    ALTER TABLE "pages_blocks_quote" ADD COLUMN IF NOT EXISTS "cta_page_id" integer;
    ALTER TABLE "_pages_v_blocks_hero" ADD COLUMN IF NOT EXISTS "cta_link_type" "enum__pages_v_blocks_hero_cta_link_type" DEFAULT 'external';
    ALTER TABLE "_pages_v_blocks_hero" ADD COLUMN IF NOT EXISTS "cta_page_id" integer;
    ALTER TABLE "_pages_v_blocks_hero" ADD COLUMN IF NOT EXISTS "secondary_c_t_a_link_type" "enum__pages_v_blocks_hero_secondary_c_t_a_link_type" DEFAULT 'external';
    ALTER TABLE "_pages_v_blocks_hero" ADD COLUMN IF NOT EXISTS "secondary_c_t_a_page_id" integer;
    ALTER TABLE "_pages_v_blocks_text_media" ADD COLUMN IF NOT EXISTS "cta_link_type" "enum__pages_v_blocks_text_media_cta_link_type" DEFAULT 'external';
    ALTER TABLE "_pages_v_blocks_text_media" ADD COLUMN IF NOT EXISTS "cta_page_id" integer;
    ALTER TABLE "_pages_v_blocks_quote" ADD COLUMN IF NOT EXISTS "cta_link_type" "enum__pages_v_blocks_quote_cta_link_type" DEFAULT 'external';
    ALTER TABLE "_pages_v_blocks_quote" ADD COLUMN IF NOT EXISTS "cta_page_id" integer;
    ALTER TABLE "projects_links" ADD COLUMN IF NOT EXISTS "link_type" "enum_projects_links_link_type" DEFAULT 'external';
    ALTER TABLE "projects_links" ADD COLUMN IF NOT EXISTS "page_id" integer;
    ALTER TABLE "_projects_v_version_links" ADD COLUMN IF NOT EXISTS "link_type" "enum__projects_v_version_links_link_type" DEFAULT 'external';
    ALTER TABLE "_projects_v_version_links" ADD COLUMN IF NOT EXISTS "page_id" integer;
    ALTER TABLE "site_settings_footer_links" ADD COLUMN IF NOT EXISTS "type" "enum_site_settings_footer_links_type" DEFAULT 'internal';
    ALTER TABLE "site_settings_footer_links" ADD COLUMN IF NOT EXISTS "page_id" integer;
  `)

  await db.execute(sql`
    DO $$ BEGIN ALTER TABLE "pages_blocks_hero" ADD CONSTRAINT "pages_blocks_hero_cta_page_id_pages_id_fk" FOREIGN KEY ("cta_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN ALTER TABLE "pages_blocks_hero" ADD CONSTRAINT "pages_blocks_hero_secondary_c_t_a_page_id_pages_id_fk" FOREIGN KEY ("secondary_c_t_a_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN ALTER TABLE "pages_blocks_text_media" ADD CONSTRAINT "pages_blocks_text_media_cta_page_id_pages_id_fk" FOREIGN KEY ("cta_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN ALTER TABLE "pages_blocks_quote" ADD CONSTRAINT "pages_blocks_quote_cta_page_id_pages_id_fk" FOREIGN KEY ("cta_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN ALTER TABLE "_pages_v_blocks_hero" ADD CONSTRAINT "_pages_v_blocks_hero_cta_page_id_pages_id_fk" FOREIGN KEY ("cta_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN ALTER TABLE "_pages_v_blocks_hero" ADD CONSTRAINT "_pages_v_blocks_hero_secondary_c_t_a_page_id_pages_id_fk" FOREIGN KEY ("secondary_c_t_a_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN ALTER TABLE "_pages_v_blocks_text_media" ADD CONSTRAINT "_pages_v_blocks_text_media_cta_page_id_pages_id_fk" FOREIGN KEY ("cta_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN ALTER TABLE "_pages_v_blocks_quote" ADD CONSTRAINT "_pages_v_blocks_quote_cta_page_id_pages_id_fk" FOREIGN KEY ("cta_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN ALTER TABLE "projects_links" ADD CONSTRAINT "projects_links_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN ALTER TABLE "_projects_v_version_links" ADD CONSTRAINT "_projects_v_version_links_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN ALTER TABLE "site_settings_footer_links" ADD CONSTRAINT "site_settings_footer_links_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
    CREATE INDEX IF NOT EXISTS "pages_blocks_hero_cta_cta_page_idx" ON "pages_blocks_hero" USING btree ("cta_page_id");
    CREATE INDEX IF NOT EXISTS "pages_blocks_hero_secondary_c_t_a_secondary_c_t_a_page_idx" ON "pages_blocks_hero" USING btree ("secondary_c_t_a_page_id");
    CREATE INDEX IF NOT EXISTS "pages_blocks_text_media_cta_cta_page_idx" ON "pages_blocks_text_media" USING btree ("cta_page_id");
    CREATE INDEX IF NOT EXISTS "pages_blocks_quote_cta_cta_page_idx" ON "pages_blocks_quote" USING btree ("cta_page_id");
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_hero_cta_cta_page_idx" ON "_pages_v_blocks_hero" USING btree ("cta_page_id");
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_hero_secondary_c_t_a_secondary_c_t_a_pag_idx" ON "_pages_v_blocks_hero" USING btree ("secondary_c_t_a_page_id");
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_text_media_cta_cta_page_idx" ON "_pages_v_blocks_text_media" USING btree ("cta_page_id");
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_quote_cta_cta_page_idx" ON "_pages_v_blocks_quote" USING btree ("cta_page_id");
    CREATE INDEX IF NOT EXISTS "projects_links_page_idx" ON "projects_links" USING btree ("page_id");
    CREATE INDEX IF NOT EXISTS "_projects_v_version_links_page_idx" ON "_projects_v_version_links" USING btree ("page_id");
    CREATE INDEX IF NOT EXISTS "site_settings_footer_links_page_idx" ON "site_settings_footer_links" USING btree ("page_id");
  `)
}
