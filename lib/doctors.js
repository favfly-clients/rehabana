import { createClient } from "@/prismicio";

/**
 * Doctor profiles, read from the Prismic `doctor` custom type.
 *
 * This module is the only place that knows Prismic's field names. It hands the
 * components a plain object, so `components/doctor` stays a presentational
 * tree that can be reasoned about without opening the CMS.
 *
 * Everything here tolerates missing content. Prismic groups come back with a
 * blank row whenever an editor adds one and moves on, and any field can be
 * left empty — so each list is filtered down to rows that actually say
 * something, and the profile page hides a section whose list ends up empty.
 */

/** Profile pages live under the team section: /team/<uid>. */
export const DOCTOR_BASE_PATH = "/team";

const SITE_URL = "https://rehabana.com";

/** Site-relative path to a doctor's profile page. */
export const getDoctorPath = (doctor) => `${DOCTOR_BASE_PATH}/${doctor.slug}`;

/** Absolute URL to a doctor's profile page, for canonicals and schema. */
export const getDoctorUrl = (doctor) => `${SITE_URL}${getDoctorPath(doctor)}`;

/**
 * Pulled in with the doctor so each condition tile can show the service page's
 * photography without a second round trip.
 */
const CONDITION_FETCH_LINKS = [
  "custom_page.featured_image",
  "service_page.featured_image",
];

/**
 * The Select options on the custom type, mapped back to the icon keys in
 * `PROCEDURE_ICONS` (components/doctor/index.jsx).
 *
 * Editors pick plain English; an option that is not listed here falls through
 * to the neutral medical icon rather than breaking the row.
 */
const ICON_KEYS = {
  Injection: "injection",
  "Scan / imaging": "imaging",
  "Bone / joint": "joint",
  Diagnostics: "diagnostics",
  "Supportive care / orthotics": "orthotics",
  "Walking / gait": "gait",
  Robotics: "robotics",
};

const text = (value) => (typeof value === "string" ? value.trim() : "");

/** Rich text down to one string per non-empty paragraph. */
const paragraphs = (field) =>
  Array.isArray(field)
    ? field
        .filter((node) => node.type === "paragraph" && text(node.text))
        .map((node) => text(node.text))
    : [];

/**
 * A rich-text field with its empty paragraphs removed. Editors leave a blank
 * line at the end more often than not, and it would render as a stray gap.
 */
const richText = (field) =>
  Array.isArray(field)
    ? field.filter((node) => node.type !== "paragraph" || text(node.text))
    : [];

/** The first paragraph of a rich-text field, or "". */
const firstParagraph = (field) => paragraphs(field)[0] ?? "";

/** A link field's URL, or "" when the editor left it empty. */
const linkUrl = (field) => text(field?.url);

/** A link-to-media field in the shape CredentialList expects, or null. */
const media = (field) =>
  field?.url ? { url: field.url, alt: text(field.name) } : null;

/** Group rows that carry content, judged by the field that must be filled. */
const rows = (group, requiredField) =>
  (Array.isArray(group) ? group : []).filter((row) =>
    text(row?.[requiredField]),
  );

/**
 * A Prismic `doctor` document, flattened into the object the profile
 * components consume.
 */
const normaliseDoctor = (doc) => {
  if (!doc) return null;

  const data = doc.data ?? {};

  // Only the three that have been filled in — an empty row would otherwise
  // render as a label with nothing beside it.
  const quickFacts = [
    { label: "Registration", value: text(data.registration_number) },
    { label: "Languages", value: text(data.languages_spoken) },
    { label: "Availability", value: text(data.consulting_hours) },
  ].filter((fact) => fact.value);

  return {
    slug: doc.uid,
    id: doc.id,

    // The linked author document is what ties blog posts to this profile.
    authorId: data.blog_author_profile?.id ?? null,

    name: text(data.full_name),
    credentials: text(data.qualifications),
    eyebrow: text(data.role_label),
    designation: text(data.job_title),
    headline: text(data.specialisation_summary),

    image: data.profile_photo?.url
      ? {
          url: data.profile_photo.url,
          alt: text(data.profile_photo.alt),
          width: data.profile_photo.dimensions?.width,
          height: data.profile_photo.dimensions?.height,
        }
      : null,

    quickFacts,

    // Centre line for this doctor; the component falls back to the main line.
    phone: text(data.phone_number),

    // Comma-separated in the editor; an array is what the schema markup wants.
    languages: text(data.languages_spoken)
      .split(",")
      .map((language) => language.trim())
      .filter(Boolean),

    stats: rows(data.key_numbers, "number").map((row) => ({
      value: text(row.number),
      label: text(row.what_it_means),
    })),

    // Ready for ConditionTiles: the linked service page supplies the photo and
    // the URL, and a condition without one renders as a plain tile.
    conditions: rows(data.conditions_treated, "condition_name").map((row) => ({
      label: text(row.condition_name),
      url: row.service_page?.url ?? null,
      image: row.service_page?.data?.featured_image ?? null,
    })),

    // Plain text, for places that cannot hold markup — meta descriptions and
    // schema.org — and to decide whether the About section shows at all.
    lead: firstParagraph(data.short_introduction),
    about: paragraphs(data.full_biography),

    // The same two fields as rich text, so hyperlinks and bold/italic the
    // editor adds in Prismic survive onto the page.
    leadField: richText(data.short_introduction),
    aboutField: richText(data.full_biography),

    procedures: rows(data.procedures, "procedure_name").map((row) => ({
      label: text(row.procedure_name),
      icon: ICON_KEYS[row.icon] ?? null,
    })),

    education: rows(data.education, "degree").map((row) => ({
      degree: text(row.degree),
      institution: text(row.college_or_institute),
      period: text(row.year),
      credentialId: text(row.certificate_number),
      credentialUrl: linkUrl(row.verification_link),
      certificate: media(row.certificate_file),
    })),

    experience: rows(data.work_experience, "role_title").map((row) => ({
      role: text(row.role_title),
      organisation: text(row.hospital_or_organisation),
      period: text(row.period),
      description: text(row.description),
    })),

    certifications: rows(data.certifications, "certification_title").map(
      (row) => ({
        title: text(row.certification_title),
        issuer: text(row.issued_by),
        period: text(row.year),
        credentialId: text(row.certificate_number),
        credentialUrl: linkUrl(row.verification_link),
        certificate: media(row.certificate_file),
      }),
    ),

    publications: rows(data.publications, "paper_title").map((row) => ({
      title: text(row.paper_title),
      source: text(row.journal_and_issue),
      period: text(row.year),
      doi: text(row.doi),
      url: linkUrl(row.article_link),
    })),

    memberships: rows(data.memberships, "membership").map((row) =>
      text(row.membership),
    ),

    awards: rows(data.awards, "award_title").map((row) => ({
      title: text(row.award_title),
      issuer: text(row.awarded_by),
      period: text(row.year),
      image: row.photo?.url ? row.photo : null,
    })),

    workshops: rows(data.workshops, "workshop_title").map((row) => ({
      title: text(row.workshop_title),
      issuer: text(row.conference_or_venue),
      period: text(row.year),
    })),

    // Keys match SOCIAL_NETWORKS in components/doctor/index.jsx. An empty
    // string renders no icon, so unused networks simply vanish.
    social: {
      linkedin: linkUrl(data.linkedin_url),
      facebook: linkUrl(data.facebook_url),
      x: linkUrl(data.x_twitter_url),
      instagram: linkUrl(data.instagram_url),
      youtube: linkUrl(data.youtube_url),
      researchgate: linkUrl(data.researchgate_url),
      scholar: linkUrl(data.google_scholar_url),
      orcid: linkUrl(data.orcid_url),
      website: linkUrl(data.personal_website_url),
    },

    // The closing call to action. Every part is optional — components/doctor
    // falls back to the wording the page shipped with, so a profile created by
    // an editor who skips this tab still ends with a working CTA.
    cta: {
      heading: text(data.cta_heading),
      description: text(data.cta_description),
      buttonLabel: text(data.cta_button_label),
      secondaryLabel: text(data.cta_secondary_button_label),
      secondaryUrl: linkUrl(data.cta_secondary_button_link),
    },

    seo: {
      title: text(data.meta_title),
      description: text(data.meta_description),
      image: data.featured_image?.url ?? null,
    },
  };
};

/** One doctor by their page slug, or null. Never throws. */
export const getDoctorBySlug = async (slug) => {
  if (!slug) return null;

  const client = createClient();
  const doc = await client
    .getByUID("doctor", slug, { fetchLinks: CONDITION_FETCH_LINKS })
    .catch(() => null);

  return normaliseDoctor(doc);
};

/** Every published doctor, for `generateStaticParams`. Never throws. */
export const getAllDoctors = async () => {
  const client = createClient();
  const docs = await client
    .getAllByType("doctor", { fetchLinks: CONDITION_FETCH_LINKS })
    .catch(() => []);

  return docs.map(normaliseDoctor).filter(Boolean);
};
