import { notFound } from "next/navigation";
import { components } from "@/slices";
import { SliceZoneWithContext } from "@/lib/SliceZoneWithContext";
import Seo from "@/lib/seo/Seo";
import SchemaMarkup from "@/components/schema-markup";
import { CardGrid, LocalTreatment } from "@/components/conditions";
import {
  CONDITIONS_BASE_PATH,
  getAllTopics,
  getConditionPath,
  getTopic,
  getTopicPath,
  getTopicSlug,
  getTopicsForCondition,
  toAbsoluteUrl,
} from "@/lib/conditions";
import {
  generateBreadcrumbSchema,
  generateFaqSchemaFromSlices,
  generateMedicalWebPageSchema,
} from "@/lib/schema-data";

/**
 * /conditions/<condition>/<topic> — one topic under a condition, e.g. the
 * Parkinson's caregiver guide. The slices carry the article; below them come
 * the condition's other topics and the Kolkata treatment hand-off.
 */
const TopicPage = async ({ params }) => {
  const found = await getTopic(params.condition, params.topic);
  if (!found) notFound();

  const { condition, topic } = found;
  const siblings = await getTopicsForCondition(condition.id);

  const conditionName = condition.data.name || condition.uid;
  const conditionPath = getConditionPath(condition);
  const conditionUrl = toAbsoluteUrl(conditionPath);
  const title = topic.data.title || topic.uid;
  const path = getTopicPath(topic);
  const url = toAbsoluteUrl(path);

  const schemas = [
    generateBreadcrumbSchema([
      { name: "Home", url: "https://rehabana.com" },
      { name: "Conditions", url: toAbsoluteUrl(CONDITIONS_BASE_PATH) },
      { name: conditionName, url: conditionUrl },
      { name: title, url },
    ]),
    generateMedicalWebPageSchema({
      name: topic.data.meta_title || title,
      description: topic.data.meta_description,
      url,
      aboutId: `${conditionUrl}#condition`,
    }),
    generateFaqSchemaFromSlices(topic.data.slices),
  ].filter(Boolean);

  const moreTopics = siblings
    .filter((sibling) => sibling.id !== topic.id && getTopicPath(sibling))
    .map((sibling) => ({
      title: sibling.data.title || sibling.uid,
      summary: sibling.data.summary,
      href: getTopicPath(sibling),
      image: sibling.data.featured_image,
    }));

  return (
    <>
      <SchemaMarkup data={schemas} />
      <SliceZoneWithContext
        slices={topic.data.slices}
        components={components}
      />
      <CardGrid
        primary={{
          subheading: "Keep reading",
          heading: [
            { type: "heading2", text: `More on ${conditionName}`, spans: [] },
          ],
        }}
        items={moreTopics}
      />
      <LocalTreatment
        link={condition.data.local_page}
        conditionName={conditionName}
      />
    </>
  );
};

export async function generateStaticParams() {
  const topics = await getAllTopics();
  return topics
    .filter((topic) => getTopicPath(topic))
    .map((topic) => ({
      condition: topic.data.condition.uid,
      topic: getTopicSlug(topic),
    }));
}

export async function generateMetadata({ params }) {
  const found = await getTopic(params.condition, params.topic);
  if (!found) return {};

  // Topics have no Prismic route, so `url` is null on the document; Seo builds
  // the canonical and og:url from it.
  return Seo({ ...found.topic, url: getTopicPath(found.topic) });
}

export default TopicPage;
