import { PrismicNextImage } from "@prismicio/next";

/**
 * A full-width image with an optional caption — for diagrams and infographics
 * whose labels would be unreadable at the half width of the default layout.
 */
const FullImageAboutSection = ({ slice }) => {
  const { image, caption } = slice?.primary || {};
  if (!image?.url) return null;

  return (
    <section>
      <div className="cs_height_60 cs_height_lg_40" />
      <div className="container">
        <figure className="mb-0">
          <PrismicNextImage
            field={image}
            className="img-fluid w-100 h-auto cs_radius_10"
            sizes="(max-width: 1320px) 100vw, 1320px"
          />
          {caption && (
            <figcaption className="text-center mt-3">{caption}</figcaption>
          )}
        </figure>
      </div>
      <div className="cs_height_60 cs_height_lg_40" />
    </section>
  );
};

export default FullImageAboutSection;
