/**
 * Rich text and slice builders shared by the content scripts in scripts/.
 *
 * They produce the raw JSON shape the Prismic Migration API expects, matched
 * to the shared slice models in slices/. Note the models' limits: most
 * description fields are SINGLE paragraph, so several paragraphs go in as one
 * split by a blank line — the way the existing service pages store them.
 */

export const SITE_URL = "https://rehabana.com";

export const node = (type, text, spans = []) => ({ type, text, spans });
export const h1 = (text) => [node("heading1", text)];
export const h2 = (text) => [node("heading2", text)];
export const h3 = (text) => [node("heading3", text)];
export const paras = (...texts) => texts.map((text) => node("paragraph", text));
export const list = (...items) => items.map((text) => node("list-item", text));

/**
 * One paragraph from several, optionally ending with an "Explore next:" line
 * whose labels are links. `links` is a list of [label, path] pairs; paths are
 * site-relative and stored as absolute rehabana.com URLs (Prismic web links
 * must be absolute). The renderer turns them back into site-relative links.
 */
export const para = (texts, links = []) => {
  const body = texts.join("\n\n");
  if (!links.length) return [node("paragraph", body)];

  const lead = `${body}\n\nExplore next: `;
  let text = lead;
  const spans = links.map(([label, path], index) => {
    if (index) text += " • ";
    const start = text.length;
    text += label;
    return {
      start,
      end: text.length,
      type: "hyperlink",
      data: { link_type: "Web", url: `${SITE_URL}${path}` },
    };
  });

  return [node("paragraph", text, spans)];
};

/** Inner-page hero: the same background every inner page on the site uses. */
export const hero = (heading, description, backgroundImage) => ({
  slice_type: "hero_section",
  variation: "secondary",
  primary: {
    heading: h1(heading),
    description: para([description]),
    background_image: backgroundImage,
  },
  items: [],
});

export const about = ({
  subheading,
  heading,
  description,
  links,
  items,
  image,
  swap,
}) => ({
  slice_type: "about_section",
  variation: "default",
  primary: {
    subheading,
    // Optional: a section continuing the one above can go without a heading.
    heading: heading ? h2(heading) : [],
    description: para(description, links),
    list: items ? list(...items) : [],
    image,
    swap_layout: Boolean(swap),
  },
  items: [],
});

/** About section, "Full Image" variation: a diagram across the full width. */
export const fullImage = (image, caption) => ({
  slice_type: "about_section",
  variation: "full_image",
  primary: { image, caption },
  items: [],
});

/** Numbered steps. `steps` is a list of [title, details, image?]. */
export const process = ({ subheading, heading, description, links, steps }) => ({
  slice_type: "process_section",
  variation: "default",
  primary: {
    subheading,
    heading: h2(heading),
    description: para(description, links),
    items: steps.map(([title, details, image]) => ({
      title: h3(title),
      details: para([details]),
      image: image || {},
    })),
  },
  items: [],
});

export const faq = (heading, questions) => ({
  slice_type: "faq_section",
  variation: "default",
  primary: {
    subheading: "FAQs",
    heading: h2(heading),
    description: [],
    items: questions.map(([question, ...answer]) => ({
      title: h3(question),
      details: paras(...answer),
    })),
  },
  items: [],
});

export const cta = ({ subheading, heading, description, links, button }) => ({
  slice_type: "cta_section",
  variation: "default",
  primary: {
    subheading,
    heading: h2(heading),
    description: para([description], links),
    primary_button: button || { link_type: "Any" },
  },
  items: [],
});
