import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Helper function to convert plain text to Lexical JSON structure
  await db.execute(sql`
    CREATE OR REPLACE FUNCTION text_to_lexical(input_text text) RETURNS jsonb AS $$
    BEGIN
      IF input_text IS NULL OR input_text = '' THEN
        RETURN NULL;
      END IF;
      RETURN jsonb_build_object(
        'root', jsonb_build_object(
          'type', 'root',
          'format', '',
          'indent', 0,
          'version', 1,
          'children', (
            SELECT jsonb_agg(
              jsonb_build_object(
                'type', 'paragraph',
                'format', '',
                'indent', 0,
                'version', 1,
                'children', jsonb_build_array(
                  jsonb_build_object(
                    'type', 'text',
                    'text', trim(para),
                    'format', 0,
                    'mode', 'normal',
                    'style', '',
                    'detail', 0,
                    'version', 1
                  )
                ),
                'direction', 'ltr',
                'textFormat', 0,
                'textStyle', ''
              )
            )
            FROM unnest(string_to_array(input_text, E'\n\n')) AS para
            WHERE trim(para) <> ''
          ),
          'direction', 'ltr'
        )
      );
    END;
    $$ LANGUAGE plpgsql;
  `)

  // Convert page block fields
  await db.execute(sql`
    ALTER TABLE "pages_blocks_hero" ALTER COLUMN "intro" TYPE jsonb USING text_to_lexical(intro);
    ALTER TABLE "pages_blocks_text_media" ALTER COLUMN "body" TYPE jsonb USING text_to_lexical(body);
    ALTER TABLE "pages_blocks_quote" ALTER COLUMN "quote" TYPE jsonb USING text_to_lexical(quote);
    ALTER TABLE "_pages_v_blocks_hero" ALTER COLUMN "intro" TYPE jsonb USING text_to_lexical(intro);
    ALTER TABLE "_pages_v_blocks_text_media" ALTER COLUMN "body" TYPE jsonb USING text_to_lexical(body);
    ALTER TABLE "_pages_v_blocks_quote" ALTER COLUMN "quote" TYPE jsonb USING text_to_lexical(quote);
  `)

  // Convert project section block fields
  await db.execute(sql`
    ALTER TABLE "projects_blocks_text" ALTER COLUMN "body" TYPE jsonb USING text_to_lexical(body);
    ALTER TABLE "projects_blocks_media_highlight" ALTER COLUMN "body" TYPE jsonb USING text_to_lexical(body);
    ALTER TABLE "projects_blocks_quote" ALTER COLUMN "quote" TYPE jsonb USING text_to_lexical(quote);
    ALTER TABLE "_projects_v_blocks_text" ALTER COLUMN "body" TYPE jsonb USING text_to_lexical(body);
    ALTER TABLE "_projects_v_blocks_media_highlight" ALTER COLUMN "body" TYPE jsonb USING text_to_lexical(body);
    ALTER TABLE "_projects_v_blocks_quote" ALTER COLUMN "quote" TYPE jsonb USING text_to_lexical(quote);
  `)

  // Convert project collection fields
  await db.execute(sql`
    ALTER TABLE "projects" ALTER COLUMN "challenge" TYPE jsonb USING text_to_lexical(challenge);
    ALTER TABLE "projects" ALTER COLUMN "solution" TYPE jsonb USING text_to_lexical(solution);
    ALTER TABLE "_projects_v" ALTER COLUMN "version_challenge" TYPE jsonb USING text_to_lexical(version_challenge);
    ALTER TABLE "_projects_v" ALTER COLUMN "version_solution" TYPE jsonb USING text_to_lexical(version_solution);
  `)

  // Convert CV summary
  await db.execute(sql`
    ALTER TABLE "cv" ALTER COLUMN "summary" TYPE jsonb USING text_to_lexical(summary);
    ALTER TABLE "_cv_v" ALTER COLUMN "version_summary" TYPE jsonb USING text_to_lexical(version_summary);
  `)

  // Cleanup helper function
  await db.execute(sql`DROP FUNCTION text_to_lexical(text);`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // Helper to extract plain text from Lexical JSON
  await db.execute(sql`
    CREATE OR REPLACE FUNCTION lexical_to_text(input_json jsonb) RETURNS text AS $$
    BEGIN
      IF input_json IS NULL THEN RETURN NULL; END IF;
      RETURN (
        SELECT string_agg(child_text, E'\n\n')
        FROM (
          SELECT string_agg(child->>'text', '' ORDER BY ordinality) AS child_text
          FROM jsonb_array_elements(input_json->'root'->'children') WITH ORDINALITY AS para(val, para_ord),
               jsonb_array_elements(para.val->'children') WITH ORDINALITY AS child(val, ordinality)
          GROUP BY para_ord
          ORDER BY para_ord
        ) sub
        WHERE child_text IS NOT NULL AND child_text <> ''
      );
    END;
    $$ LANGUAGE plpgsql;
  `)

  await db.execute(sql`
    ALTER TABLE "pages_blocks_hero" ALTER COLUMN "intro" TYPE varchar USING lexical_to_text(intro::jsonb);
    ALTER TABLE "pages_blocks_text_media" ALTER COLUMN "body" TYPE varchar USING lexical_to_text(body::jsonb);
    ALTER TABLE "pages_blocks_quote" ALTER COLUMN "quote" TYPE varchar USING lexical_to_text(quote::jsonb);
    ALTER TABLE "_pages_v_blocks_hero" ALTER COLUMN "intro" TYPE varchar USING lexical_to_text(intro::jsonb);
    ALTER TABLE "_pages_v_blocks_text_media" ALTER COLUMN "body" TYPE varchar USING lexical_to_text(body::jsonb);
    ALTER TABLE "_pages_v_blocks_quote" ALTER COLUMN "quote" TYPE varchar USING lexical_to_text(quote::jsonb);

    ALTER TABLE "projects_blocks_text" ALTER COLUMN "body" TYPE varchar USING lexical_to_text(body::jsonb);
    ALTER TABLE "projects_blocks_media_highlight" ALTER COLUMN "body" TYPE varchar USING lexical_to_text(body::jsonb);
    ALTER TABLE "projects_blocks_quote" ALTER COLUMN "quote" TYPE varchar USING lexical_to_text(quote::jsonb);
    ALTER TABLE "_projects_v_blocks_text" ALTER COLUMN "body" TYPE varchar USING lexical_to_text(body::jsonb);
    ALTER TABLE "_projects_v_blocks_media_highlight" ALTER COLUMN "body" TYPE varchar USING lexical_to_text(body::jsonb);
    ALTER TABLE "_projects_v_blocks_quote" ALTER COLUMN "quote" TYPE varchar USING lexical_to_text(quote::jsonb);

    ALTER TABLE "projects" ALTER COLUMN "challenge" TYPE varchar USING lexical_to_text(challenge::jsonb);
    ALTER TABLE "projects" ALTER COLUMN "solution" TYPE varchar USING lexical_to_text(solution::jsonb);
    ALTER TABLE "_projects_v" ALTER COLUMN "version_challenge" TYPE varchar USING lexical_to_text(version_challenge::jsonb);
    ALTER TABLE "_projects_v" ALTER COLUMN "version_solution" TYPE varchar USING lexical_to_text(version_solution::jsonb);

    ALTER TABLE "cv" ALTER COLUMN "summary" TYPE varchar USING lexical_to_text(summary::jsonb);
    ALTER TABLE "_cv_v" ALTER COLUMN "version_summary" TYPE varchar USING lexical_to_text(version_summary::jsonb);
  `)

  await db.execute(sql`DROP FUNCTION lexical_to_text(jsonb);`)
}
