// No imports: middleware.js runs this on the Edge runtime, and the tests run
// it under plain Node (`node --test lib/redirects.test.mjs`).

/** The one host the site should be reached on. */
export const CANONICAL_ORIGIN = "https://rehabana.com";

/**
 * Hosts that serve this same deployment but must never be indexed. A request
 * on one of them is sent to the same path on CANONICAL_ORIGIN.
 *
 * - `rehabana.vercel.app`: the production alias Vercel gives the project.
 *   Preview deployments get other `*.vercel.app` names and are left alone.
 * - `www.rehabana.com`: today Vercel's domain settings redirect it before the
 *   app sees the request. Listing it here means that if www is ever attached
 *   to the project without that redirect, old www URLs still resolve in one
 *   hop (see the PR for the Vercel setting).
 */
export const HOST_ALIASES = new Set(["www.rehabana.com", "rehabana.vercel.app"]);

/**
 * Old URLs (mostly from the WordPress site) and the live page each now lives
 * at. Keys are lower-case, without a trailing slash. A target may itself be
 * an old URL: resolveRedirect follows the map to the end, so the visitor
 * still gets one hop.
 *
 * Source: SEO audit Nov 2026, internal report §4 "10 Backlinks" redirect map
 * (ClickUp 14zdwxwrjz2), plus the redirects that used to live in vercel.json.
 */
export const LEGACY_REDIRECTS = {
  // ==== Old WordPress URLs that returned 404 (audit row 2, BL4) ====
  // Until the Kalighat centre page exists (ClickUp 14zdwxwrk0v), /contact.
  "/rehabana-kalighat": "/contact",
  "/about-us": "/about",
  "/contact-us": "/contact",
  "/specialservice/parkinsons-treatment-in-kolkata":
    "/parkinsons-treatment-in-kolkata",
  "/specialservice/stroke-rehab": "/stroke-rehabilitation-in-kolkata",
  "/specialservice/spinal-injury": "/spinal-cord-rehabilitation-in-kolkata",
  "/spinal-injury-treatment": "/spinal-cord-rehabilitation-in-kolkata",
  "/specialservice/peripheral-neuropathy-treatment-in-kolkata":
    "/peripheral-neuropathy-treatment-in-kolkata",
  "/specialservice/motor-neurone-disease":
    "/motor-neuron-disease-treatment-kolkata",
  "/specialservice/paralysis": "/paralysis-rehabilitation-in-kolkata",
  "/rehabservice/occupational-therapy": "/occupational-therapy-in-kolkata",
  "/rehabservice/psychotherapy": "/psychotherapy-in-kolkata",
  "/5-cutting-edge-treatments-for-neuropathy-in-2024-discover-relief-now":
    "/5-cutting-edge-treatments-for-neuropathy-discover-relief-now",
  "/our-therapy-team": "/team",
  "/author/sayani": "/authors/dr-sayani-haldar",
  "/galleries": "/gallery",
  "/our-robots": "/robotic-rehab-in-kolkata",
  "/stroke-recovery": "/brain-stroke-recovery",
  "/category/stroke-rehab": "/blog",
  "/testimonial/mrs-sikha-das": "/testimonials",

  // ==== Chains collapsed to one hop (audit row 2) ====
  // /rehabservice/<slug> is handled by the pattern below; its hub goes to
  // /services rather than the homepage.
  "/rehabservice": "/services",

  // ==== Moved from vercel.json ====
  "/motor-neuron-disease": "/motor-neuron-disease-treatment-kolkata",
  "/garden-therapy": "/garden-therapy-in-kolkata",
  "/post-surgery-rehabilitation-centre":
    "/post-surgery-rehabilitation-centre-in-kolkata",
  "/robotic-rehab": "/robotic-rehab-in-kolkata",
  "/in-patient-module": "/in-patient-module-neuro-rehab-in-kolkata",
  "/pain-spasticity": "/pain-spasticity-kolkata",
  "/digital-rehab": "/digital-rehab-kolkata",
  "/conditions/parkinsons-disease/parkinsons-caregiver-guide/parkinsons-home-safety":
    "/parkinsons-disease/caregiver-guide/home-safety",
  "/parkinsons-disease/parkinsons-caregiver-guide/parkinsons-home-safety":
    "/parkinsons-disease/caregiver-guide/home-safety",
};

const PD_TOPICS =
  "symptoms|rehabilitation|physiotherapy|occupational-therapy|speech-swallowing|non-motor-symptoms|caregiver-guide";
const MS_TOPICS =
  "symptoms|rehabilitation|physiotherapy|occupational-therapy|speech-swallowing|cognitive-changes|caregiver-guide|community-reintegration";
const MS_PREFIX = "(?:/conditions)?/multiple-sclerosis";
const PD_PREFIX = "(?:/conditions)?/parkinsons-disease";

/**
 * Pattern redirects, tried in order after LEGACY_REDIRECTS. These are the
 * rules that used to live in vercel.json, unchanged in meaning.
 *
 * @type {[RegExp, string][]}
 */
export const PATTERN_REDIRECTS = [
  // Old WordPress service URLs: /rehabservice/<slug> -> /<slug>
  [/^\/rehabservice\/(.+)$/i, "/$1"],
  [new RegExp(`^${PD_PREFIX}/parkinsons-(${PD_TOPICS})$`, "i"), "/parkinsons-disease/$1"],
  [new RegExp(`^${PD_PREFIX}/(?:parkinsons-treatments|treatments)$`, "i"), "/parkinsons-disease/treatment"],
  [new RegExp(`^${PD_PREFIX}/(?:parkinsons-gait-and-mobility|gait-and-mobility)$`, "i"), "/parkinsons-disease/gait-problems"],
  [new RegExp(`^${MS_PREFIX}/ms-(${MS_TOPICS})$`, "i"), "/multiple-sclerosis/$1"],
  [new RegExp(`^${MS_PREFIX}/ms-treatments$`, "i"), "/multiple-sclerosis/treatment"],
  [new RegExp(`^${MS_PREFIX}/ms-gait-and-mobility$`, "i"), "/multiple-sclerosis/gait-problems"],
  [new RegExp(`^${MS_PREFIX}/ms-balance-and-coordination$`, "i"), "/multiple-sclerosis/balance-problems"],
  [new RegExp(`^${MS_PREFIX}/ms-spasticity-and-pain$`, "i"), "/multiple-sclerosis/spasticity-pain"],
  [new RegExp(`^${MS_PREFIX}/ms-fatigue-and-sleep$`, "i"), "/multiple-sclerosis/fatigue-sleep"],
  // Condition pages at level 2-3 are served from the site root
  // (lib/condition-urls.js): /conditions/<root>/<rest> -> /<root>/<rest>
  [/^\/conditions\/([^/]+\/.+)$/i, "/$1"],
];

// A loop in the tables above must not hang the middleware.
const MAX_STEPS = 10;

const stripTrailingSlash = (path) =>
  path.length > 1 ? path.replace(/\/+$/, "") || "/" : path;

/**
 * One step through the tables: the next path for `path`, or null when no
 * rule applies.
 *
 * @param {string} path - A path without a trailing slash.
 * @returns {string | null}
 */
const nextPath = (path) => {
  const exact = LEGACY_REDIRECTS[path.toLowerCase()];
  if (exact) return exact;

  for (const [pattern, replacement] of PATTERN_REDIRECTS) {
    if (pattern.test(path)) return path.replace(pattern, replacement);
  }

  return null;
};

/**
 * Follows every rule to the final path, so a chain of old URLs becomes one
 * redirect.
 *
 * @param {string} pathname - The request path, e.g. "/rehabservice/robotic-rehab/".
 * @returns {string} The path the request should end up on (may be unchanged).
 */
export const resolvePath = (pathname) => {
  let path = stripTrailingSlash(pathname);

  for (let step = 0; step < MAX_STEPS; step += 1) {
    const next = nextPath(path);
    if (next === null || next === path) break;
    path = stripTrailingSlash(next);
  }

  return path;
};

/**
 * Works out whether a request must be redirected, and where to. Host, trailing
 * slash and old URLs are all settled at once, so the visitor sees one hop.
 *
 * @param {{ host?: string | null; pathname: string; search?: string; keepHost?: boolean }} request
 *   `keepHost` skips the host move (e.g. during a Prismic preview, whose
 *   cookie is set on the host the editor opened).
 * @returns {string | null} The absolute or relative URL to redirect to, or
 *   null when the request can be served as it is.
 */
export const resolveRedirect = ({ host, pathname, search = "", keepHost = false }) => {
  const hostname = (host ?? "").toLowerCase().split(":")[0];
  const moveHost = !keepHost && HOST_ALIASES.has(hostname);
  const path = resolvePath(pathname);

  if (!moveHost && path === pathname) return null;

  return moveHost ? `${CANONICAL_ORIGIN}${path}${search}` : `${path}${search}`;
};
