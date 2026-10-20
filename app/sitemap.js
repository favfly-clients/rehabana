import { createClient } from "@/prismicio";
import {
  CONDITIONS_BASE_PATH,
  getAllConditions,
  getAllTopics,
  getConditionPath,
  getConditionsPage,
  getTopicPath,
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

  // custom_page and blog_post are served by [slug]; service_page by services/[slug]
  const [blog_post, custom_page, service_page] = await Promise.all([
    client.getAllByType("blog_post"),
    client.getAllByType("custom_page"),
    client.getAllByType("service_page"),
  ]);

  const staticPages = [
    ...links,
    ...custom_page,
    ...blog_post,
    ...service_page.map((doc) => ({ ...doc, uid: `services/${doc.uid}` })),
  ];

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

  // The conditions section is nested, so its URLs come from lib/conditions.js
  // rather than from `uid`. The hub is listed only once its singleton exists.
  const [conditionsPage, conditions, topics] = await Promise.all([
    getConditionsPage(),
    getAllConditions(),
    getAllTopics(),
  ]);

  const conditionPaths = [
    ...(conditionsPage ? [[CONDITIONS_BASE_PATH, conditionsPage]] : []),
    ...conditions.map((doc) => [getConditionPath(doc), doc]),
    ...topics
      .filter((doc) => getTopicPath(doc))
      .map((doc) => [getTopicPath(doc), doc]),
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
