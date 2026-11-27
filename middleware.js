import { NextResponse } from "next/server";
import { resolveRedirect } from "@/lib/redirects";

// Set by @prismicio/next when an editor opens a preview. The cookie belongs to
// the host the preview was opened on, so that host must not be moved.
const PRISMIC_PREVIEW_COOKIE = "io.prismic.preview";

/**
 * Sends old URLs, trailing slashes and non-canonical hosts to their final
 * page in a single permanent redirect (308). `next.config.mjs` turns off
 * Next's own trailing-slash redirect so it can't add a hop in front of this.
 *
 * @param {import("next/server").NextRequest} request
 */
export function middleware(request) {
  const { pathname, search } = request.nextUrl;

  const destination = resolveRedirect({
    host: request.headers.get("host"),
    pathname,
    search,
    keepHost: request.cookies.has(PRISMIC_PREVIEW_COOKIE),
  });

  if (!destination) return NextResponse.next();

  return NextResponse.redirect(new URL(destination, request.url), 308);
}

export const config = {
  // Not for API routes (Prismic webhooks and previews), build assets or the
  // Slice Machine simulator.
  matcher: ["/((?!api/|_next/|slice-simulator|favicon\\.ico).*)"],
};
