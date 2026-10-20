import { createClient } from "@/prismicio";
import {
  CONDITIONS_BASE_PATH,
  getConditionTree,
  getConditionsPage,
} from "@/lib/conditions";

const websiteUrl = `https://${process.env.PRISMIC_ID}.${process.env.TLD}`;

const generateSiteMap = async () => {
  // Static app routes (from app/ directory: page.jsx, about/, blog/, contact/, gallery/, services/, team/, testimonials/)
  const links = [
    { uid: "" },
    { uid: "about" },
    { uid: "blog" },
    { uid: "contact" },
    { uid: "gallery" },
    { uid: "services" },
    { uid: "team" },
    { uid: "testimonials" },
  ];

  const client = createClient();

  // Fetch all content types (custom_page + service_page served by [slug], blog_post by [slug])
  const [blog_post, custom_page, service_page] = await Promise.all([
    client.getAllByType("blog_post"),
    client.getAllByType("custom_page"),
    client.getAllByType("service_page"),
  ]);

  // Static app pages + custom_page and service_page routes (all served at /[slug])
  const staticPages = [...links, ...custom_page, ...service_page, ...blog_post];

  const toValidDate = (value) => {
    if (!value) return new Date();
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? new Date() : d;
  };

  const staticSlugs = staticPages.map((item) => ({
    url: `${websiteUrl}/${item?.uid || ""}`,
    lastModified: toValidDate(item?.last_publication_date),
    changeFrequency: "monthly",
    priority: item?.uid === "" ? 1.0 : 0.8,
  }));

  // The conditions section is nested, so its URLs come from the condition
  // tree rather than from `uid`. The hub is listed only once its singleton
  // exists; pages too deep to place are already left out of the tree.
  const [conditionsPage, tree] = await Promise.all([
    getConditionsPage(),
    getConditionTree(),
  ]);

  const conditionPaths = [
    ...(conditionsPage ? [[CONDITIONS_BASE_PATH, conditionsPage]] : []),
    ...tree.map(({ path, doc }) => [path, doc]),
  ];

  const conditionSlugs = conditionPaths.map(([path, doc]) => ({
    url: `${websiteUrl}${path}`,
    lastModified: toValidDate(doc?.last_publication_date),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const sitemap = [...staticSlugs, ...conditionSlugs];

  return sitemap;
};

const sitemap = async () => {
  const res = await generateSiteMap();
  return res;
};

export default sitemap;
