import { PrismicRichText } from "@prismicio/react";
import { detailRichTextComponents } from "./rich-text-components";

/**
 * Long-form detail block: one rich text field. Headings, lists, links and
 * images are all written inside the text, so an image sits wherever the editor
 * places it.
 *
 * @param {{ slice: { primary?: { content?: object[] } } }} props
 * @returns {JSX.Element | null}
 */
const DetailSection = ({ slice }) => {
  const content = slice?.primary?.content;

  if (!content?.length) return null;

  return (
    <section className="cs_about cs_style_1 position-relative">
      <div className="cs_height_80 cs_height_lg_60" />
      <div className="container">
        <PrismicRichText
          field={content}
          components={detailRichTextComponents}
        />
      </div>
      <div className="cs_height_80 cs_height_lg_60" />
    </section>
  );
};

export default DetailSection;
