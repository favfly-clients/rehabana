import { createClient } from "@/prismicio";

/**
 * Shared engine for a nested Prismic section (conditions, assessments):
 *
 *   /<base>                 singleton landing page
 *   /<base>/a[/b[/c]]       repeatable page, a tree via its `parent` link
 *
 * Prismic's route resolver follows `parent.parent` at most, so a page is capped
 * at MAX_DEPTH segments. A deeper page would get a wrong URL from Prismic; it is
 * left out of the tree (404, not in the sitemap) and logged.
 */

const SITE_URL = "https://rehabana.com";

/** Prismic's route resolver follows `parent.parent` at most. */
export const MAX_DEPTH = 3;

export const toAbsoluteUrl = (path) => `${SITE_URL}${path}`;

const parentId = (doc) => doc?.data?.parent?.id || null;

/** Short card / breadcrumb name: the meta title before any " | Brand" suffix. */
export const getPageLabel = (doc) =>
  doc?.data?.meta_title?.split(" | ")[0]?.trim() || doc?.uid || "";

/**
 * Card per page, keyed by document id, so a hand-picked link can be shown as a
 * card without fetching the linked document again.
 *
 * @param {{ doc: object; path: string }[]} tree - From getTree.
 * @returns {Record<string, { title: string; summary?: string; href: string; image?: object }>} Card by document id.
 */
export const toCardsById = (tree) =>
  Object.fromEntries(
    tree.map(({ doc, path }) => [
      doc.id,
      {
        title: getPageLabel(doc),
        summary: doc.data.meta_description,
        href: path,
        image: doc.data.featured_image,
      },
    ]),
  );

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

/**
 * Builds the helpers for one nested section.
 *
 * @param {{ basePath: string; type: string; singleton: string; logTag: string }} config
 * @returns {{
 *   buildTree: (docs: object[]) => { doc: object; chain: object[]; path: string }[];
 *   getLandingPage: () => Promise<object | null>;
 *   getTree: () => Promise<{ doc: object; chain: object[]; path: string }[]>;
 *   findByPath: (tree: object[], segments?: string[]) => { doc: object; chain: object[]; path: string } | null;
 * }} Section helpers.
 */
export const createPageTree = ({ basePath, type, singleton, logTag }) => {
  const toEntry = (doc, byId) => {
    const chain = buildChain(doc, byId);
    if (!chain) return { doc, problem: "missing parent or a parent loop" };
    if (chain.length > MAX_DEPTH) {
      return { doc, problem: `${chain.length} levels deep (max ${MAX_DEPTH})` };
    }
    const path = `${basePath}/${chain.map((item) => item.uid).join("/")}`;
    return { doc, chain, path };
  };

  const buildTree = (docs) => {
    const byId = new Map(docs.map((doc) => [doc.id, doc]));
    const entries = docs.map((doc) => toEntry(doc, byId));

    for (const { doc, problem } of entries.filter((entry) => entry.problem)) {
      console.warn(`[${logTag}] Skipped "${doc.uid}": ${problem}.`);
    }

    return entries
      .filter((entry) => !entry.problem)
      .sort((a, b) => a.doc.uid.localeCompare(b.doc.uid));
  };

  const getLandingPage = async () =>
    createClient()
      .getSingle(singleton)
      .catch(() => null);

  // One query feeds the page, the sitemap and static params, so they always
  // agree on which URLs exist.
  const getTree = async () => {
    const docs = await createClient()
      .getAllByType(type)
      .catch(() => []);
    return buildTree(docs);
  };

  const findByPath = (tree, segments = []) => {
    const path = `${basePath}/${segments.join("/")}`;
    return tree.find((entry) => entry.path === path) ?? null;
  };

  return { buildTree, getLandingPage, getTree, findByPath };
};
