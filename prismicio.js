Need to update these things also because the backend is currently updated as OpenAI is known, so the code and the frontend parts should be updated as per our conditions. Please check the whole application code, all files and structures. You can use subagents for scanning, get the report, and find and update these things import { createClient as baseCreateClient } from "@prismicio/client";
import { enableAutoPreviews } from "@prismicio/next";
import sm from "./slicemachine.config.json";

/**
 * The project's Prismic repository name.
 */
export const repositoryName =
  process.env.NEXT_PUBLIC_PRISMIC_ENVIRONMENT || sm.repositoryName;

/**
 * A list of Route Resolver objects that define how a document's `url` field is resolved.
 *
 * {@link https://prismic.io/docs/route-resolver#route-resolver}
 *
 * @type {import("@prismicio/client").Route[]}
 */
const routes = [
  { type: "home_page", path: "/" },
  { type: "about_page", path: "/about" },
  { type: "blog_page", path: "/blog" },
  { type: "blog_post", path: "/:uid" },
  { type: "conditions_page", path: "/conditions" },
  { type: "condition", path: "/conditions/:uid" },
  // `condition_topic` is left out on purpose: its URL needs the parent
  // condition's slug and a trimmed UID, which a route can't express. Its URL
  // comes from `linkResolver` in lib/conditions.js.
  { type: "contact_page", path: "/contact" },
  { type: "custom_page", path: "/:uid" },
  { type: "doctor", path: "/team/:uid" },
  { type: "gallery_page", path: "/gallery" },
  { type: "service_page", path: "/:uid" },
  { type: "services_page", path: "/services" },
  { type: "team_page", path: "/team" },
  { type: "testimonials_page", path: "/testimonials" },
];

/**
 * Fields the Services slice cards read from the page each card links to.
 * Asked for on every query so a card keeps its title, text and photo whatever
 * the slice model's link config says; a query that passes its own
 * `fetchLinks` replaces this list.
 */
const SERVICE_CARD_FETCH_LINKS = ["custom_page", "service_page"].flatMap(
  (type) => [
    `${type}.meta_title`,
    `${type}.meta_description`,
    `${type}.featured_image`,
  ],
);

/**
 * Creates a Prismic client for the project's repository. The client is used to
 * query content from the Prismic API.
 *
 * @param {import("@prismicio/client").ClientConfig} config - Configuration for the Prismic client.
 */
export const createClient = (config = {}) => {
  const client = baseCreateClient(repositoryName, {
    routes,
    accessToken: process.env.PRISMIC_ACCESS_TOKEN,
    defaultParams: { fetchLinks: SERVICE_CARD_FETCH_LINKS },
    fetchOptions:
      process.env.NODE_ENV === "production"
        ? { next: { tags: ["prismic"] }, cache: "force-cache" }
        : { next: { revalidate: 5 } },
    ...config,
  });

  enableAutoPreviews({ client });

  return client;
};
