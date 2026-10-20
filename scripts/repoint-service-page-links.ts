/**
 * Re-points every link that targets an old `service_page` document to its
 * `custom_page` copy (same UID, so the visitor-facing URL does not change).
 * Needed before the service page route moves to `/services/:uid` or the old
 * documents are deleted — both would otherwise break these links.
 *
 *   node_modules/.bin/jiti scripts/repoint-service-page-links.ts                 # dry run
 *   node_modules/.bin/jiti scripts/repoint-service-page-links.ts --only <uid>    # one document
 *   node_modules/.bin/jiti scripts/repoint-service-page-links.ts --write         # all documents
 *
 * Needs PRISMIC_WRITE_TOKEN in .env.local for writes. Writes land in the
 * MIGRATION RELEASE; nothing changes on the site until it is published.
 */

import dotenv from "dotenv";
import * as prismic from "@prismicio/client";

dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

import sm from "../slicemachine.config.json";
import NEW_IDS from "../backups/prismic/2026-10-20-service-to-custom/migration-ids.json";
import { preserveImageCrops } from "./lib/preserve-image-crops";

const REPOSITORY =
  process.env.NEXT_PUBLIC_PRISMIC_ENVIRONMENT || sm.repositoryName;

const OLD_TYPE = "service_page";
const NEW_TYPE = "custom_page";
const LINK_EXTRAS = ["text", "target", "variant"];

type Doc = prismic.PrismicDocument<Record<string, any>>;
type Json = Record<string, unknown>;

const isOldLink = (value: Json): boolean =>
  value.link_type === "Document" && value.type === OLD_TYPE && !value.isBroken;

// === NOTE: === only the target id changes; label, target and variant are kept.
const toNewLink = (value: Json): Json => {
  const id = NEW_IDS[value.uid as keyof typeof NEW_IDS];
  if (!id) throw new Error(`No custom page copy for ${value.uid}`);
  const extras = LINK_EXTRAS.filter((key) => value[key] !== undefined);
  return { link_type: "Document", id, ...Object.fromEntries(extras.map((key) => [key, value[key]])) };
};

// === HACK: === same as the copy script — the Migration API rejects a
// never-filled link that still carries its row key.
const isBareEmptyLink = (value: Json): boolean =>
  value.link_type === "Any" &&
  Object.keys(value).every((key) => key === "link_type" || key === "key");

const repoint = (value: unknown, found: string[]): unknown => {
  if (Array.isArray(value)) return value.map((item) => repoint(item, found));
  if (!value || typeof value !== "object") return value;
  const record = value as Json;
  if (isOldLink(record)) {
    found.push(record.uid as string);
    return toNewLink(record);
  }
  if (isBareEmptyLink(record)) return { link_type: "Any" };
  return Object.fromEntries(
    Object.entries(record).map(([key, item]) => [key, repoint(item, found)]),
  );
};

// === NOTE: === a custom page copy is rebuilt from its original service page,
// not from the copy, because the first copy lost a few zoomed image crops.
const plan = (docs: Doc[]) => {
  const originals = new Map(
    docs.filter((doc) => doc.type === OLD_TYPE).map((doc) => [doc.uid, doc.data]),
  );
  return docs
    .filter((doc) => doc.type !== OLD_TYPE)
    .map((doc) => {
      const found: string[] = [];
      const base = doc.type === NEW_TYPE ? originals.get(doc.uid) ?? doc.data : doc.data;
      const data = repoint(base, found) as Doc["data"];
      return { doc, data, found };
    })
    .filter((item) => item.found.length);
};

const labelOf = (doc: Doc): string => `${doc.type} / ${doc.uid ?? "(single)"}`;

// === HACK: === these images were deleted from the media library but still
// render from the CDN, and the Migration API refuses a document that uses a
// missing asset. Each was re-uploaded byte-identical (same file, same pixel
// size); the image keeps its live size and crop and only its asset changes.
const RESTORED_ASSETS: Record<string, string> = {
  aZ7NWMFoBIGEgxLg: "XuwX50W6u02cV5sT_130634.jpg.jpeg",
  aaA5ecFoBIGEg29g: "KnFH6Kxu73ujOkMo_144240.jpg",
};
const CDN_BASE = `https://images.prismic.io/${REPOSITORY}/`;

const useRestoredAssets = (value: unknown): unknown => {
  if (Array.isArray(value)) return value.map(useRestoredAssets);
  if (!value || typeof value !== "object") return value;
  const record = value as Json;
  const file = RESTORED_ASSETS[record.id as string];
  if (file && record.dimensions) {
    const query = (record.url as string).split("?")[1];
    return { ...record, id: file.split("_")[0], url: `${CDN_BASE}${file}?${query}` };
  }
  return Object.fromEntries(
    Object.entries(record).map(([key, item]) => [key, useRestoredAssets(item)]),
  );
};

const write = async (client: prismic.WriteClient, items: ReturnType<typeof plan>) => {
  const failed: string[] = [];
  for (const { doc, data } of items) {
    const safeData = (await preserveImageCrops(useRestoredAssets(data))) as Doc["data"];
    try {
      const migration = prismic.createMigration<Doc>();
      migration.updateDocument({ ...doc, data: safeData }, doc.data.meta_title || doc.uid || doc.type);
      await client.migrate(migration);
      console.log(`  updated  ${labelOf(doc)}`);
    } catch (error: any) {
      failed.push(labelOf(doc));
      console.log(`  FAILED   ${labelOf(doc)}\n${JSON.stringify(error?.response ?? error?.message, null, 2)}`);
    }
  }
  return failed;
};

const createClient = (needsWrite: boolean) => {
  const accessToken = process.env.PRISMIC_ACCESS_TOKEN;
  if (!needsWrite) return prismic.createClient(REPOSITORY, { accessToken });
  const writeToken = process.env.PRISMIC_WRITE_TOKEN;
  if (!writeToken) throw new Error("PRISMIC_WRITE_TOKEN is not set — add it to .env.local.");
  return prismic.createWriteClient(REPOSITORY, { writeToken, accessToken });
};

const main = async () => {
  const onlyIndex = process.argv.indexOf("--only");
  const only = onlyIndex > -1 ? process.argv[onlyIndex + 1] : null;
  const shouldWrite = Boolean(only) || process.argv.includes("--write");
  const client = createClient(shouldWrite);

  const items = plan(await client.dangerouslyGetAll()).filter(
    (item) => !only || item.doc.uid === only || item.doc.type === only,
  );
  for (const { doc, found } of items) console.log(`  ${found.length}  ${labelOf(doc)}`);
  const total = items.reduce((sum, item) => sum + item.found.length, 0);
  console.log(`\n${items.length} documents, ${total} links to re-point.`);
  if (!shouldWrite) return;

  const failed = await write(client as prismic.WriteClient, items);
  console.log(`\n${items.length - failed.length}/${items.length} updated.`);
  if (failed.length) process.exitCode = 1;
};

main().catch((error) => {
  console.error(`\nFailed: ${error.message}`);
  process.exitCode = 1;
});
