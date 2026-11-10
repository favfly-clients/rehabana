import { createPageTree } from "@/lib/page-tree";

export {
  MAX_DEPTH,
  getPageLabel,
  toAbsoluteUrl,
  toCardsById,
} from "@/lib/page-tree";

/**
 * The assessments section:
 *
 *   /assessments                assessments_page  (singleton landing page)
 *   /assessments/a[/b[/c]]      assessment_page   (repeatable, a tree)
 *
 * Tree rules and the 3-level cap live in lib/page-tree.js.
 */
export const ASSESSMENTS_BASE_PATH = "/assessments";

const section = createPageTree({
  basePath: ASSESSMENTS_BASE_PATH,
  type: "assessment_page",
  singleton: "assessments_page",
  logTag: "assessments",
});

/** Every placeable assessment page with its ancestor chain and URL, A-Z by UID. */
export const buildAssessmentTree = section.buildTree;

/** The /assessments singleton, or null if it hasn't been created yet. */
export const getAssessmentsPage = section.getLandingPage;

/** All placeable assessment pages. */
export const getAssessmentTree = section.getTree;

/** The entry whose URL matches these segments exactly, or null. */
export const findByPath = section.findByPath;
