import { createPageTree } from "@/lib/page-tree";

export {
  MAX_DEPTH,
  getPageLabel,
  toAbsoluteUrl,
  toCardsById,
} from "@/lib/page-tree";

/**
 * The national conditions section:
 *
 *   /conditions          conditions_page  (singleton landing page)
 *   /conditions/a        condition_page   level 1
 *   /a/b, /a/b/c         condition_page   levels 2-3, at the site root
 *
 * Old /conditions/a/b[/c] URLs 301 to the root (vercel.json).
 * Tree rules and the 3-level cap live in lib/page-tree.js.
 */
export const CONDITIONS_BASE_PATH = "/conditions";

/**
 * URL for a condition page from its ancestor chain (top-level first).
 *
 * @param {{ uid: string }[]} chain - The page and its ancestors, top-level first.
 * @returns {string} `/conditions/a` for level 1, `/a/b[/c]` for deeper pages.
 */
export const toConditionPath = (chain) => {
  const uids = chain.map((item) => item.uid).join("/");
  return chain.length === 1 ? `${CONDITIONS_BASE_PATH}/${uids}` : `/${uids}`;
};

const section = createPageTree({
  basePath: CONDITIONS_BASE_PATH,
  type: "condition_page",
  singleton: "conditions_page",
  logTag: "conditions",
  toPath: toConditionPath,
});

/** Every placeable condition page with its ancestor chain and URL, A-Z by UID. */
export const buildConditionTree = section.buildTree;

/** The /conditions singleton, or null if it hasn't been created yet. */
export const getConditionsPage = section.getLandingPage;

/** All placeable condition pages. */
export const getConditionTree = section.getTree;

/** The entry served at exactly this URL path, or null. */
export const findByUrl = section.findByUrl;
