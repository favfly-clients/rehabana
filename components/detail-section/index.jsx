import { PrismicNextImage } from "@prismicio/next";
import { PrismicRichText } from "@prismicio/react";
import { SectionHeading } from "@/components/ui";
import { createRichTextComponents } from "@/lib/richTextComponents";

const richTextComponents = createRichTextComponents({
  paragraphClassName: "cs_about_text leading-relaxed",
});

/**
 * Long-form detail block: a heading, then text blocks that each take an
 * optional image. An image is drawn only when it is set, so a text-only block
 * never leaves an empty column.
 *
 * @param {{ slice: { primary?: object; items?: object[] } }} props
 * @returns {JSX.Element}
 */
const DetailSection = ({ slice }) => {
  const { primary, items = [] } = slice || {};

  return (
    <section className="cs_about cs_style_1 position-relative">
      <div className="cs_height_120 cs_height_lg_80" />
      <div className="container">
        <SectionHeading
          primary={primary}
          variant="left"
          includeDescription={false}
        />
        <div className="cs_height_40 cs_height_lg_30" />
        {items.map((item, index) => (
          <DetailBlock key={index} item={item} />
        ))}
      </div>
      <div className="cs_height_120 cs_height_lg_80" />
    </section>
  );
};

/**
 * One text block with its optional image.
 *
 * @param {{ item: { details?: object[]; image?: object } }} props
 * @returns {JSX.Element}
 */
const DetailBlock = ({ item }) => {
  const { details, image } = item;

  return (
    <div className="cs_detail_block mb-5">
      {details?.length > 0 && (
        <PrismicRichText field={details} components={richTextComponents} />
      )}
      {image?.url && (
        <PrismicNextImage
          field={image}
          className="img-fluid cs_radius_10 mt-4"
          sizes="(max-width: 991px) 100vw, 66vw"
        />
      )}
    </div>
  );
};

export default DetailSection;
