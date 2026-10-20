import {
  generateBreadcrumbSchema,
  generateMedicalServiceSchema,
  generateWebPageSchema,
  services,
} from "@/lib/schema-data";

const SITE_URL = "https://rehabana.com";

/**
 * Finds the known service whose URL is this path.
 *
 * @param {string} path - The page's path on the site, e.g. "/physiotherapy-in-kolkata".
 * @returns {{ name: string; url: string; description: string; image?: string } | undefined} The matching entry from `services`, if any.
 */
export const findKnownService = (path) =>
  services.find((service) => service.url === `${SITE_URL}${path}`);

/**
 * Builds the structured data for a page that describes a service — a breadcrumb
 * under Services plus, when the page is one of the known services in
 * `lib/schema-data`, its WebPage and MedicalProcedure entries.
 *
 * @param {string} path - The page's path on the site, e.g. "/physiotherapy-in-kolkata".
 * @param {import("@prismicio/client").PrismicDocument} page - The page document; its meta title names the breadcrumb when the service is not in the known list.
 * @returns {object[]} Schema objects ready for `<SchemaMarkup data={...} />`.
 */
export const buildServiceSchemas = (path, page) => {
  const url = `${SITE_URL}${path}`;
  const known = findKnownService(path);
  const name = known?.name ?? page?.data?.meta_title;

  const breadcrumb = generateBreadcrumbSchema([
    { name: "Home", url: SITE_URL },
    { name: "Services", url: `${SITE_URL}/services` },
    ...(name ? [{ name, url }] : []),
  ]);

  if (!known) return [breadcrumb];

  return [
    breadcrumb,
    generateWebPageSchema({
      name: `${known.name} in Kolkata | Rehabana`,
      description: known.description,
      url,
    }),
    generateMedicalServiceSchema(known),
  ];
};
