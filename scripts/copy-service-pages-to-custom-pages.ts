/**
 * Copies every `service_page` document into `custom_page` with the same UID,
 * language, tags and data, so `service_page` can be retired without any URL
 * changing (both types resolve to `/:uid`).
 *
 *   node_modules/.bin/jiti scripts/copy-service-pages-to-custom-pages.ts            # dry run
 *   node_modules/.bin/jiti scripts/copy-service-pages-to-custom-pages.ts --write    # stage copies
 *   node_modules/.bin/jiti scripts/copy-service-pages-to-custom-pages.ts --verify   # after publish
 *
 * Needs PRISMIC_WRITE_TOKEN in .env.local for --write (.env is tracked by git).
 *
 * The data is copied as fetched, never rebuilt by hand: images keep their asset
 * id and links keep their target document id, so nothing is re-uploaded.
 *
 * --write lands in the MIGRATION RELEASE. Nothing changes on the site until
 * that release is published in Prismic. The service pages are never touched.
 *
 * Re-running --write is harmless: a UID that already exists as a custom page
 * is skipped.
 */

import dotenv from "dotenv";
import { isDeepStrictEqual } from "node:util";
import * as prismic from "@prismicio/client";

dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

import sm from "../slicemachine.config.json";
import customPageModel from "../customtypes/custom_page/index.json";

const REPOSITORY =
  process.env.NEXT_PUBLIC_PRISMIC_ENVIRONMENT || sm.repositoryName;

const SOURCE_TYPE = "service_page";
const TARGET_TYPE = "custom_page";

type Doc = prismic.PrismicDocument<Record<string, any>>;

const allowedSlices = new Set(
  Object.keys(customPageModel.json.Main.slices.config.choices),
);

const findMissingSlices = (doc: Doc): string[] =>
  (doc.data.slices ?? [])
    .map((slice: { slice_type: string }) => slice.slice_type)
    .filter((sliceType: string) => !allowedSlices.has(sliceType));

const fetchBoth = async (client: prismic.Client) => {
  const [sources, targets] = await Promise.all([
    client.getAllByType(SOURCE_TYPE),
    client.getAllByType(TARGET_TYPE),
  ]);
  return { sources, targets: new Map(targets.map((doc) => [doc.uid, doc])) };
};

// === NOTE: === every source must fit the target model before anything is
// written, so a single missing slice stops the whole run instead of leaving a
// half-copied set behind.
const assertCopyable = (sources: Doc[]): void => {
  const problems = sources.flatMap((doc) => {
    const missing = findMissingSlices(doc);
    return missing.length ? [`${doc.uid}: ${missing.join(", ")}`] : [];
  });
  if (problems.length) {
    throw new Error(`Slices not allowed on ${TARGET_TYPE}:\n  ${problems.join("\n  ")}`);
  }
};

const titleOf = (doc: Doc): string => doc.data.meta_title || doc.uid || doc.id;

const stage = async (client: prismic.WriteClient, sources: Doc[]) => {
  const migration = prismic.createMigration();
  for (const doc of sources) {
    migration.createDocument(
      {
        type: TARGET_TYPE,
        uid: doc.uid,
        lang: doc.lang,
        tags: doc.tags,
        data: structuredClone(doc.data),
      },
      titleOf(doc),
    );
  }
  await client.migrate(migration, {
    reporter: (event) => console.log(`  ${event.type}`),
  });
};

const verify = (sources: Doc[], targets: Map<string | null, Doc>): number => {
  let failures = 0;
  for (const source of sources) {
    const target = targets.get(source.uid);
    const ok = target && isDeepStrictEqual(source.data, target.data);
    if (!ok) failures += 1;
    console.log(`  ${ok ? "same   " : target ? "DIFFERS" : "MISSING"}  ${source.uid}`);
  }
  return failures;
};

const createClient = (write: boolean) => {
  const accessToken = process.env.PRISMIC_ACCESS_TOKEN;
  if (!write) return prismic.createClient(REPOSITORY, { accessToken });
  const writeToken = process.env.PRISMIC_WRITE_TOKEN;
  if (!writeToken) {
    throw new Error(
      "PRISMIC_WRITE_TOKEN is not set — add it to .env.local. Generate one at\n" +
        `  https://${REPOSITORY}.prismic.io/settings/ (API & Security -> Migration API)`,
    );
  }
  return prismic.createWriteClient(REPOSITORY, { writeToken, accessToken });
};

const main = async () => {
  const mode = process.argv.includes("--write")
    ? "write"
    : process.argv.includes("--verify") ? "verify" : "dry-run";
  const client = createClient(mode === "write");
  const { sources, targets } = await fetchBoth(client);
  assertCopyable(sources);

  if (mode === "verify") {
    const failures = verify(sources, targets);
    console.log(`\n${sources.length - failures}/${sources.length} identical.`);
    if (failures) process.exitCode = 1;
    return;
  }

  const pending = sources.filter((doc) => !targets.has(doc.uid));
  for (const doc of sources) {
    console.log(`  ${targets.has(doc.uid) ? "skip  " : "create"}  ${doc.uid}`);
  }
  console.log(`\n${pending.length} to create, ${sources.length - pending.length} already copied.`);
  if (mode === "dry-run" || !pending.length) return;

  await stage(client as prismic.WriteClient, pending);
  console.log(`\nDone. Publish the Migration Release at\n  https://${REPOSITORY}.prismic.io/releases`);
};

main().catch((error) => {
  console.error(`\nFailed: ${error.message}`);
  process.exitCode = 1;
});
