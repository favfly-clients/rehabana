import Link from "next/link";
import { FaArrowRightLong } from "react-icons/fa6";
import { PrismicNextImage } from "@prismicio/next";
import { SectionHeading } from "@/components/ui";

/**
 * Cards for the conditions on /conditions, or the topics on a condition page.
 * Same card as the Services section, but filled from documents rather than
 * picked by hand, so a newly published condition or topic shows up on its own.
 * Renders nothing when there are no cards yet.
 *
 * @param {{
 *   primary?: { subheading?: string; heading?: object[]; description?: object[] };
 *   items: { title: string; summary?: string; href: string; image?: object }[];
 * }} props
 */
const CardGrid = ({ primary, items = [] }) => {
  if (!items.length) return null;

  return (
    <section className="cs_service_area cs_type_3">
      <div className="cs_height_80 cs_height_lg_60" />
      <div className="container">
        <SectionHeading primary={primary} variant="center" />
        <div className="cs_height_50 cs_height_lg_40" />
        <div className="row cs_gap_y_30">
          {items.map((item) => (
            <Card key={item.href} item={item} />
          ))}
        </div>
      </div>
      <div className="cs_height_80 cs_height_lg_60" />
    </section>
  );
};

const Card = ({ item }) => {
  const { title, summary, href, image } = item;

  return (
    <div className="col-lg-4 col-md-6">
      {/* The title link is stretched over the whole card (`stretched-link` +
          `position-relative`), so the card is one link and one tab stop. */}
      <div className="cs_iconbox cs_style_8 cs_white_bg cs_radius_10 h-100 position-relative">
        {image?.url && (
          <div className="cs_card_thumbnail cs_radius_10 mb-4">
            <PrismicNextImage
              field={image}
              className="img-fluid cs_radius_10"
              sizes="(max-width: 767px) 100vw, (max-width: 991px) 50vw, 33vw"
            />
          </div>
        )}
        <h3 className="cs_iconbox_title cs_fs_20 cs_semibold mb-2">
          <Link href={href} className="stretched-link">
            {title}
          </Link>
        </h3>

        {summary && <p className="cs_iconbox_subtitle">{summary}</p>}

        <span className="cs_text_btn cs_fs_16 cs_heading_color" aria-hidden="true">
          <span>Read More</span>
          <span className="cs_text_btn_icon cs_center">
            <span>
              <FaArrowRightLong />
            </span>
            <span>
              <FaArrowRightLong />
            </span>
          </span>
        </span>
      </div>
    </div>
  );
};

export default CardGrid;
