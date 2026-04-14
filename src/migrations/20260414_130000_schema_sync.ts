import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Fully idempotent: safe to re-run after partial failure

  // ── Enum types ──────────────────────────────────────────
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_cv_skills_level" AS ENUM('1','2','3','4','5');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      CREATE TYPE "public"."enum__cv_v_version_skills_level" AS ENUM('1','2','3','4','5');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
  `)

  // ── Missing tables ──────────────────────────────────────
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "projects_rels" (
      "id" serial PRIMARY KEY NOT NULL,
      "order" integer,
      "parent_id" integer NOT NULL,
      "path" varchar NOT NULL,
      "pages_id" integer,
      "projects_id" integer
    );

    CREATE TABLE IF NOT EXISTS "_projects_v_rels" (
      "id" serial PRIMARY KEY NOT NULL,
      "order" integer,
      "parent_id" integer NOT NULL,
      "path" varchar NOT NULL,
      "pages_id" integer,
      "projects_id" integer
    );
  `)

  // ── Missing columns on existing tables ──────────────────
  await db.execute(sql`
    ALTER TABLE "pages_rels" ADD COLUMN IF NOT EXISTS "pages_id" integer;
    ALTER TABLE "_pages_v_rels" ADD COLUMN IF NOT EXISTS "pages_id" integer;

    ALTER TABLE "cv_experience" ADD COLUMN IF NOT EXISTS "company_url" varchar;
    ALTER TABLE "_cv_v_version_experience" ADD COLUMN IF NOT EXISTS "company_url" varchar;

    ALTER TABLE "cv_education" ADD COLUMN IF NOT EXISTS "institution_url" varchar;
    ALTER TABLE "_cv_v_version_education" ADD COLUMN IF NOT EXISTS "institution_url" varchar;

    ALTER TABLE "cv_certificates" ADD COLUMN IF NOT EXISTS "issuer_url" varchar;
    ALTER TABLE "_cv_v_version_certificates" ADD COLUMN IF NOT EXISTS "issuer_url" varchar;
  `)

  // ── Convert cv_skills.level from numeric to enum ────────
  await db.execute(sql`
    DO $$ BEGIN
      IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'cv_skills' AND column_name = 'level' AND data_type = 'numeric'
      ) THEN
        ALTER TABLE "cv_skills" ALTER COLUMN "level" DROP DEFAULT;
        ALTER TABLE "cv_skills" ALTER COLUMN "level" TYPE "enum_cv_skills_level"
          USING (COALESCE(level::int::text, '3'))::"enum_cv_skills_level";
        ALTER TABLE "cv_skills" ALTER COLUMN "level" SET DEFAULT '3'::"enum_cv_skills_level";
      END IF;
    END $$;

    DO $$ BEGIN
      IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = '_cv_v_version_skills' AND column_name = 'level' AND data_type = 'numeric'
      ) THEN
        ALTER TABLE "_cv_v_version_skills" ALTER COLUMN "level" DROP DEFAULT;
        ALTER TABLE "_cv_v_version_skills" ALTER COLUMN "level" TYPE "enum__cv_v_version_skills_level"
          USING (COALESCE(level::int::text, '3'))::"enum__cv_v_version_skills_level";
        ALTER TABLE "_cv_v_version_skills" ALTER COLUMN "level" SET DEFAULT '3'::"enum__cv_v_version_skills_level";
      END IF;
    END $$;
  `)

  // ── Foreign keys for new tables ─────────────────────────
  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "projects_rels" ADD CONSTRAINT "projects_rels_parent_fk"
        FOREIGN KEY ("parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "projects_rels" ADD CONSTRAINT "projects_rels_pages_fk"
        FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "projects_rels" ADD CONSTRAINT "projects_rels_projects_fk"
        FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "_projects_v_rels" ADD CONSTRAINT "_projects_v_rels_parent_fk"
        FOREIGN KEY ("parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "_projects_v_rels" ADD CONSTRAINT "_projects_v_rels_pages_fk"
        FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "_projects_v_rels" ADD CONSTRAINT "_projects_v_rels_projects_fk"
        FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
  `)

  // ── Foreign keys for new columns on existing tables ─────
  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_pages_fk"
        FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_pages_fk"
        FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
  `)

  // ── Indexes for new tables ──────────────────────────────
  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "projects_rels_order_idx" ON "projects_rels" USING btree ("order");
    CREATE INDEX IF NOT EXISTS "projects_rels_parent_idx" ON "projects_rels" USING btree ("parent_id");
    CREATE INDEX IF NOT EXISTS "projects_rels_path_idx" ON "projects_rels" USING btree ("path");
    CREATE INDEX IF NOT EXISTS "projects_rels_pages_id_idx" ON "projects_rels" USING btree ("pages_id");
    CREATE INDEX IF NOT EXISTS "projects_rels_projects_id_idx" ON "projects_rels" USING btree ("projects_id");

    CREATE INDEX IF NOT EXISTS "_projects_v_rels_order_idx" ON "_projects_v_rels" USING btree ("order");
    CREATE INDEX IF NOT EXISTS "_projects_v_rels_parent_idx" ON "_projects_v_rels" USING btree ("parent_id");
    CREATE INDEX IF NOT EXISTS "_projects_v_rels_path_idx" ON "_projects_v_rels" USING btree ("path");
    CREATE INDEX IF NOT EXISTS "_projects_v_rels_pages_id_idx" ON "_projects_v_rels" USING btree ("pages_id");
    CREATE INDEX IF NOT EXISTS "_projects_v_rels_projects_id_idx" ON "_projects_v_rels" USING btree ("projects_id");

    CREATE INDEX IF NOT EXISTS "pages_rels_pages_id_idx" ON "pages_rels" USING btree ("pages_id");
    CREATE INDEX IF NOT EXISTS "_pages_v_rels_pages_id_idx" ON "_pages_v_rels" USING btree ("pages_id");
  `)

  // ── Drop stale columns (in prod from init, removed in dev) ──
  await db.execute(sql`
    ALTER TABLE "cv_experience" DROP COLUMN IF EXISTS "duration";
    ALTER TABLE "_cv_v_version_experience" DROP COLUMN IF EXISTS "duration";

    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "phone";

    ALTER TABLE "cv" DROP COLUMN IF EXISTS "phone";
    ALTER TABLE "_cv_v" DROP COLUMN IF EXISTS "version_phone";

    ALTER TABLE "cv" DROP COLUMN IF EXISTS "skill_max_dots";
    ALTER TABLE "_cv_v" DROP COLUMN IF EXISTS "version_skill_max_dots";

    ALTER TABLE "pages_blocks_hero" DROP COLUMN IF EXISTS "cta_href";
    ALTER TABLE "pages_blocks_hero" DROP COLUMN IF EXISTS "secondary_c_t_a_href";
    ALTER TABLE "_pages_v_blocks_hero" DROP COLUMN IF EXISTS "cta_href";
    ALTER TABLE "_pages_v_blocks_hero" DROP COLUMN IF EXISTS "secondary_c_t_a_href";

    ALTER TABLE "pages_blocks_text_media" DROP COLUMN IF EXISTS "cta_href";
    ALTER TABLE "_pages_v_blocks_text_media" DROP COLUMN IF EXISTS "cta_href";

    ALTER TABLE "pages_blocks_quote" DROP COLUMN IF EXISTS "cta_href";
    ALTER TABLE "_pages_v_blocks_quote" DROP COLUMN IF EXISTS "cta_href";
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // Reverse the schema sync - restore stale columns, drop new ones
  await db.execute(sql`
    ALTER TABLE "cv_experience" ADD COLUMN IF NOT EXISTS "duration" varchar;
    ALTER TABLE "_cv_v_version_experience" ADD COLUMN IF NOT EXISTS "duration" varchar;
    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "phone" varchar;
    ALTER TABLE "cv" ADD COLUMN IF NOT EXISTS "phone" varchar;
    ALTER TABLE "_cv_v" ADD COLUMN IF NOT EXISTS "version_phone" varchar;
    ALTER TABLE "cv" ADD COLUMN IF NOT EXISTS "skill_max_dots" numeric DEFAULT 4;
    ALTER TABLE "_cv_v" ADD COLUMN IF NOT EXISTS "version_skill_max_dots" numeric DEFAULT 4;

    ALTER TABLE "cv_certificates" DROP COLUMN IF EXISTS "issuer_url";
    ALTER TABLE "_cv_v_version_certificates" DROP COLUMN IF EXISTS "issuer_url";
    ALTER TABLE "cv_education" DROP COLUMN IF EXISTS "institution_url";
    ALTER TABLE "_cv_v_version_education" DROP COLUMN IF EXISTS "institution_url";
    ALTER TABLE "cv_experience" DROP COLUMN IF EXISTS "company_url";
    ALTER TABLE "_cv_v_version_experience" DROP COLUMN IF EXISTS "company_url";
    ALTER TABLE "pages_rels" DROP COLUMN IF EXISTS "pages_id";
    ALTER TABLE "_pages_v_rels" DROP COLUMN IF EXISTS "pages_id";

    DROP TABLE IF EXISTS "_projects_v_rels" CASCADE;
    DROP TABLE IF EXISTS "projects_rels" CASCADE;

    -- Revert skills level back to numeric
    ALTER TABLE "cv_skills" ALTER COLUMN "level" DROP DEFAULT;
    ALTER TABLE "cv_skills" ALTER COLUMN "level" TYPE numeric USING (level::text::numeric);
    ALTER TABLE "cv_skills" ALTER COLUMN "level" SET DEFAULT 4;
    ALTER TABLE "_cv_v_version_skills" ALTER COLUMN "level" DROP DEFAULT;
    ALTER TABLE "_cv_v_version_skills" ALTER COLUMN "level" TYPE numeric USING (level::text::numeric);
    ALTER TABLE "_cv_v_version_skills" ALTER COLUMN "level" SET DEFAULT 4;

    DROP TYPE IF EXISTS "public"."enum_cv_skills_level";
    DROP TYPE IF EXISTS "public"."enum__cv_v_version_skills_level";
  `)
}
