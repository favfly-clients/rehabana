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
// === NOTE: === ids of the custom pages the first --write created in the
// Migration Release before it stopped; --resume fills these instead of
// creating duplicates.
import MIGRATION_IDS from "../backups/prismic/2026-10-20-service-to-custom/migration-ids.json";

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

const isBareEmptyLink = (value: Record<string, unknown>): boolean =>
  value.link_type === "Any" &&
  Object.keys(value).every((key) => key === "link_type" || key === "key");

// === HACK: === the Content API returns a never-filled link as
// `{ link_type: "Any", key }`, and the Migration API rejects that exact shape
// ("not configured to be repeatable"). Dropping the key keeps it an empty link
// — no target, no label — so the page renders the same.
const dropEmptyLinkKeys = (value: unknown): unknown => {
  if (Array.isArray(value)) return value.map(dropEmptyLinkKeys);
  if (!value || typeof value !== "object") return value;
  const record = value as Record<string, unknown>;
  if (isBareEmptyLink(record)) return { link_type: "Any" };
  return Object.fromEntries(
    Object.entries(record).map(([key, item]) => [key, dropEmptyLinkKeys(item)]),
  );
};

// === NOTE: === a link's `key` is Prismic's internal row id, not content;
// verify ignores it so a regenerated key is not reported as a difference.
const withoutLinkKeys = (value: unknown): unknown => {
  if (Array.isArray(value)) return value.map(withoutLinkKeys);
  if (!value || typeof value !== "object") return value;
  const record = value as Record<string, unknown>;
  const isLink = "link_type" in record;
  return Object.fromEntries(
    Object.entries(record)
      .filter(([key]) => !(isLink && key === "key"))
      .map(([key, item]) => [key, withoutLinkKeys(item)]),
  );
};

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

const describeError = (error: any): string =>
  JSON.stringify(error?.response ?? error?.message ?? error, null, 2);

// === NOTE: === one migrate call per page, so one rejected page cannot stop
// the rest from being filled, and its exact rejection reason gets printed.
const fill = async (client: prismic.WriteClient, sources: Doc[]) => {
  const failed: string[] = [];
  for (const doc of sources) {
    const id = MIGRATION_IDS[doc.uid as string];
    if (!id) throw new Error(`No staged custom page id for ${doc.uid}`);
    const migration = prismic.createMigration();
    migration.updateDocument(
      { ...doc, id, type: TARGET_TYPE, data: dropEmptyLinkKeys(doc.data) as Doc["data"] },
      titleOf(doc),
    );
    try {
      await client.migrate(migration);
      console.log(`  filled  ${doc.uid}`);
    } catch (error) {
      failed.push(doc.uid as string);
      console.log(`  FAILED  ${doc.uid}\n${describeError(error)}`);
    }
  }
  return failed;
};

const verify = (sources: Doc[], targets: Map<string | null, Doc>): number => {
  let failures = 0;
  for (const source of sources) {
    const target = targets.get(source.uid);
    const ok =
      target &&
      isDeepStrictEqual(withoutLinkKeys(source.data), withoutLinkKeys(target.data));
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
  const flag = ["--write", "--resume", "--verify"].find((item) => process.argv.includes(item));
  const mode = flag?.slice(2) ?? "dry-run";
  const client = createClient(mode === "write" || mode === "resume");
  const { sources, targets } = await fetchBoth(client);
  assertCopyable(sources);

  if (mode === "resume") {
    const failed = await fill(client as prismic.WriteClient, sources);
    console.log(`\n${sources.length - failed.length}/${sources.length} filled.`);
    if (failed.length) process.exitCode = 1;
    return;
  }

  // === NOTE: === the staged pages are invisible to the read API until the
  // release is published, so --write cannot tell they exist and would create
  // duplicates; stop it once an id file exists.
  if (mode === "write" && Object.keys(MIGRATION_IDS).length) {
    throw new Error("Copies are already staged — use --resume to fill them.");
  }

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
