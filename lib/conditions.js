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
 *   /conditions                 conditions_page  (singleton landing page)
 *   /conditions/a[/b[/c]]       condition_page   (repeatable, a tree)
 *
 * Tree rules and the 3-level cap live in lib/page-tree.js.
 */
export const CONDITIONS_BASE_PATH = "/conditions";

const section = createPageTree({
  basePath: CONDITIONS_BASE_PATH,
  type: "condition_page",
  singleton: "conditions_page",
  logTag: "conditions",
});

/** Every placeable condition page with its ancestor chain and URL, A-Z by UID. */
export const buildConditionTree = section.buildTree;

/** The /conditions singleton, or null if it hasn't been created yet. */
export const getConditionsPage = section.getLandingPage;

/** All placeable condition pages. */
export const getConditionTree = section.getTree;

/** The entry whose URL matches these segments exactly, or null. */
export const findByPath = section.findByPath;
