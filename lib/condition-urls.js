// No imports: prismicio.js uses this, and lib/conditions.js imports prismicio.js.

export const CONDITIONS_BASE_PATH = "/conditions";

const CONDITION_TYPE = "condition_page";

// /conditions/<root>/<child>[/<grandchild>] -> /<root>/<child>[/<grandchild>]
const NESTED_CONDITION_URL = new RegExp(`^${CONDITIONS_BASE_PATH}(/[^/]+/.+)$`);

const toServedUrl = (url) => url.replace(NESTED_CONDITION_URL, "$1");

const isObject = (value) => value !== null && typeof value === "object";

/**
 * Rewrites every condition_page URL in a Prismic API response to the URL the
 * site serves. Prismic's route resolver allows one pattern per type, so it
 * can't give level 1 `/conditions/a` and deeper pages `/a/b`; this closes the
 * gap once, for links, rich text hyperlinks and documents alike.
 *
 * @param {unknown} value - Parsed Prismic JSON (any depth).
 * @returns {unknown} A copy with condition URLs rewritten; the input is untouched.
 */
export const rewriteConditionUrls = (value) => {
  if (Array.isArray(value)) return value.map(rewriteConditionUrls);
  if (!isObject(value)) return value;

  const copy = Object.fromEntries(
    Object.entries(value).map(([key, item]) => [key, rewriteConditionUrls(item)]),
  );

  return copy.type === CONDITION_TYPE && typeof copy.url === "string"
    ? { ...copy, url: toServedUrl(copy.url) }
    : copy;
};

/**
 * A fetch for the Prismic client that applies rewriteConditionUrls to every
 * JSON response. Caching options pass through to the real fetch unchanged.
 *
 * @param {RequestInfo | URL} input - Request URL.
 * @param {RequestInit} [init] - Request options (incl. Next.js cache options).
 * @returns {Promise<Response>} The response, with condition URLs rewritten.
 */
export const fetchWithConditionUrls = async (input, init) => {
  const response = await fetch(input, init);
  const isJson = response.headers.get("content-type")?.includes("json");
  if (!response.ok || !isJson) return response;

  const body = rewriteConditionUrls(await response.json());
  // The body is re-encoded, so the original length and encoding no longer apply.
  const headers = new Headers(response.headers);
  headers.delete("content-length");
  headers.delete("content-encoding");

  return new Response(JSON.stringify(body), {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
};
