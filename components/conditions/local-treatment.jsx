import { PrismicNextLink } from "@prismicio/next";
import { isFilled } from "@prismicio/client";

/**
 * The hand-off from the national condition pages to the Kolkata service page
 * that books patients. Hidden until an editor picks that page on the condition.
 *
 * @param {{ link: object; conditionName: string }} props
 */
const LocalTreatment = ({ link, conditionName }) => {
  if (!isFilled.contentRelationship(link)) return null;

  const pageTitle = link.data?.meta_title;

  return (
    <div className="container">
      <section
        className="cs_cta cs_style_1 mt-0 cs_radius_10 cs_gray_bg"
        style={{ padding: "40px 30px" }}
      >
        <div className="cs_cta_in">
          <div className="cs_cta_info">
            <h2 className="cs_cta_title">
              Looking for {conditionName} treatment in Kolkata?
            </h2>
            {pageTitle && <p className="cs_cta_subtitle mb-0">{pageTitle}</p>}
          </div>
          <PrismicNextLink
            field={link}
            className="cs_btn cs_style_1 cs_accent_bg cs_radius_100"
            style={{ padding: "10px 20px" }}
          >
            <span className="cs_btn_text">See treatment at Rehabana</span>
          </PrismicNextLink>
        </div>
      </section>
      <div className="cs_height_80 cs_height_lg_60" />
    </div>
  );
};

export default LocalTreatment;
