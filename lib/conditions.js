import { createClient } from "@/prismicio";

/**
 * The national conditions section, read from two Prismic custom types:
 *
 *   /conditions                 conditions_page  (singleton landing page)
 *   /conditions/a[/b[/c]]       condition_page   (repeatable, a tree)
 *
 * A condition page sits under another one through its `parent` link, and its
 * URL is its ancestors' UIDs plus its own. Prismic's route resolver builds that
 * URL (see prismicio.js), but it only follows a parent and a grandparent, so a
 * page is capped at MAX_DEPTH segments. A deeper page would get a wrong URL
 * from Prismic; it is left out of the tree (404, not in the sitemap) and
 * logged so an editor can move it up.
 */

export const CONDITIONS_BASE_PATH = "/conditions";

const SITE_URL = "https://rehabana.com";

const TYPE = "condition_page";

/** Prismic's route resolver follows `parent.parent` at most. */
export const MAX_DEPTH = 3;

export const toAbsoluteUrl = (path) => `${SITE_URL}${path}`;

const parentId = (doc) => doc?.data?.parent?.id || null;

/** Short card / breadcrumb name: the meta title before any " | Brand" suffix. */
export const getPageLabel = (doc) =>
  doc?.data?.meta_title?.split(" | ")[0]?.trim() || doc?.uid || "";

/**
 * The page and its ancestors, top-level first. Null when a parent is missing
 * (unpublished or deleted) or the parent links loop back on themselves.
 */
const buildChain = (doc, byId) => {
  const chain = [];
  let current = doc;
  while (current) {
    if (chain.includes(current)) return null;
    chain.unshift(current);
    const id = parentId(current);
    if (!id) return chain;
    current = byId.get(id);
  }
  return null;
};

const toEntry = (doc, byId) => {
  const chain = buildChain(doc, byId);
  if (!chain) return { doc, problem: "missing parent or a parent loop" };
  if (chain.length > MAX_DEPTH) {
    return { doc, problem: `${chain.length} levels deep (max ${MAX_DEPTH})` };
  }
  const path = `${CONDITIONS_BASE_PATH}/${chain.map((item) => item.uid).join("/")}`;
  return { doc, chain, path };
};

/**
 * Every published condition page with its ancestor chain and URL, sorted A-Z
 * by UID. Pages that can't be placed are dropped and logged.
 *
 * @param {object[]} docs - All condition_page documents.
 * @returns {{ doc: object; chain: object[]; path: string }[]} Placeable pages.
 */
export const buildConditionTree = (docs) => {
  const byId = new Map(docs.map((doc) => [doc.id, doc]));
  const entries = docs.map((doc) => toEntry(doc, byId));

  for (const { doc, problem } of entries.filter((entry) => entry.problem)) {
    console.warn(`[conditions] Skipped "${doc.uid}": ${problem}.`);
  }

  return entries
    .filter((entry) => !entry.problem)
    .sort((a, b) => a.doc.uid.localeCompare(b.doc.uid));
};

/** The /conditions singleton, or null if it hasn't been created yet. */
export const getConditionsPage = async () =>
  createClient()
    .getSingle("conditions_page")
    .catch(() => null);

/**
 * All placeable condition pages. One query feeds the page, the sitemap and
 * static params, so they always agree on which URLs exist.
 *
 * @returns {Promise<{ doc: object; chain: object[]; path: string }[]>}
 */
export const getConditionTree = async () => {
  const docs = await createClient()
    .getAllByType(TYPE)
    .catch(() => []);
  return buildConditionTree(docs);
};

/**
 * The entry whose URL matches these segments exactly, or null.
 *
 * @param {object[]} tree - From getConditionTree.
 * @param {string[]} segments - The URL segments after /conditions.
 * @returns {{ doc: object; chain: object[]; path: string } | null}
 */
export const findByPath = (tree, segments = []) => {
  const path = `${CONDITIONS_BASE_PATH}/${segments.join("/")}`;
  return tree.find((entry) => entry.path === path) ?? null;
};

/**
 * Direct children of a page, or the top-level pages when `doc` is null.
 *
 * @param {object[]} tree - From getConditionTree.
 * @param {object | null} doc - The parent page.
 * @returns {object[]} Child entries, A-Z by UID.
 */
export const getChildren = (tree, doc) =>
  tree.filter((entry) => parentId(entry.doc) === (doc?.id ?? null));

/** Turns tree entries into CardGrid items. */
export const toCards = (entries) =>
  entries.map(({ doc, path }) => ({
    title: getPageLabel(doc),
    summary: doc.data.meta_description,
    href: path,
    image: doc.data.featured_image,
  }));

/**
 * Splits a slice zone so code-rendered blocks can sit straight under the hero:
 * a leading hero_section goes in `lead`, everything else in `rest`.
 */
export const splitLeadingHero = (slices = []) =>
  slices[0]?.slice_type === "hero_section"
    ? { lead: slices.slice(0, 1), rest: slices.slice(1) }
    : { lead: [], rest: slices };
