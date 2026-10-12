import * as prismic from "@prismicio/client";
import { createClient } from "@/prismicio";

/**
 * The national conditions section, read from three Prismic custom types:
 *
 *   /conditions                              conditions_page  (singleton)
 *   /conditions/<condition>                  condition        (repeatable)
 *   /conditions/<condition>/<topic>          condition_topic  (repeatable)
 *
 * A topic is tied to its condition by the `condition` link field, not by its
 * UID. Prismic UIDs are unique per type, and "physiotherapy" or
 * "caregiver-guide" will exist under more than one condition — so editors
 * prefix the UID with the condition slug (`parkinsons-disease-caregiver-guide`)
 * and the URL drops that prefix again (`/conditions/parkinsons-disease/
 * caregiver-guide`). A UID without the prefix still works; it is used as is.
 *
 * This section is separate from the Kolkata service pages at the site root.
 * Those stay where they are; a condition links to its one through `local_page`.
 */

export const CONDITIONS_BASE_PATH = "/conditions";

const SITE_URL = "https://rehabana.com";

/** The Kolkata page's title comes along so the card can name it. */
const CONDITION_FETCH_LINKS = ["service_page.meta_title"];

const ORDER = (type) => [
  { field: `my.${type}.order`, direction: "asc" },
  { field: `my.${type}.${type === "condition" ? "name" : "title"}` },
];

/** UID of the condition a topic belongs to, from its link field. */
const parentUid = (topic) => topic?.data?.condition?.uid || null;

/** The URL segment for a topic: its UID minus the `<condition>-` prefix. */
export const getTopicSlug = (topic) => {
  const uid = topic?.uid || "";
  const prefix = parentUid(topic) ? `${parentUid(topic)}-` : "";
  return prefix && uid.startsWith(prefix) ? uid.slice(prefix.length) : uid;
};

export const getConditionPath = (condition) =>
  `${CONDITIONS_BASE_PATH}/${condition.uid}`;

/** Null when the topic has no condition picked — it has nowhere to live. */
export const getTopicPath = (topic) =>
  parentUid(topic)
    ? `${CONDITIONS_BASE_PATH}/${parentUid(topic)}/${getTopicSlug(topic)}`
    : null;

export const toAbsoluteUrl = (path) => `${SITE_URL}${path}`;

/**
 * Resolves topic URLs, which the route list in prismicio.js can't. Returning
 * null hands every other type back to those routes.
 */
export const linkResolver = (doc) =>
  doc?.type === "condition_topic" ? getTopicPath(doc) : null;

/** The /conditions singleton, or null if it hasn't been created yet. */
export const getConditionsPage = async () =>
  createClient()
    .getSingle("conditions_page")
    .catch(() => null);

export const getAllConditions = async () =>
  createClient()
    .getAllByType("condition", { orderings: ORDER("condition") })
    .catch(() => []);

export const getCondition = async (uid) =>
  createClient()
    .getByUID("condition", uid, { fetchLinks: CONDITION_FETCH_LINKS })
    .catch(() => null);

export const getAllTopics = async () =>
  createClient()
    .getAllByType("condition_topic", { orderings: ORDER("condition_topic") })
    .catch(() => []);

export const getTopicsForCondition = async (conditionId) =>
  createClient()
    .getAllByType("condition_topic", {
      filters: [prismic.filter.at("my.condition_topic.condition", conditionId)],
      orderings: ORDER("condition_topic"),
    })
    .catch(() => []);

/**
 * The topic at /conditions/<conditionUid>/<topicSlug>, with its condition.
 * Null unless the topic really belongs to that condition, so a topic can't be
 * reached under someone else's URL.
 */
export const getTopic = async (conditionUid, topicSlug) => {
  const client = createClient();
  const byUid = (uid) =>
    client.getByUID("condition_topic", uid).catch(() => null);

  const [condition, prefixed, bare] = await Promise.all([
    getCondition(conditionUid),
    byUid(`${conditionUid}-${topicSlug}`),
    byUid(topicSlug),
  ]);

  const topic = [prefixed, bare].find(
    (doc) => doc && doc.data?.condition?.id === condition?.id,
  );

  return condition && topic ? { condition, topic } : null;
};

/**
 * Splits a slice zone so code-rendered blocks can sit straight under the hero:
 * a leading hero_section goes in `lead`, everything else in `rest`.
 */
export const splitLeadingHero = (slices = []) =>
  slices[0]?.slice_type === "hero_section"
    ? { lead: slices.slice(0, 1), rest: slices.slice(1) }
    : { lead: [], rest: slices };
