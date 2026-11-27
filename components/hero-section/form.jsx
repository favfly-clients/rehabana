"use client";

import { FaCheck } from "react-icons/fa6";
import { PrismicRichText } from "@prismicio/react";
import OpnFormIframe from "@/components/form/OpnFormIframe";
import { createRichTextComponents } from "@/lib/richTextComponents";

const HeroSectionForm = ({ slice }) => {
  const { primary } = slice || {};
  const { subheading, heading, description, list, form_title } = primary || {};

  const listItems = Array.isArray(list)
    ? list.map((item) => item?.text).filter(Boolean)
    : [];

  return (
    <section
      className="cs_hero cs_style_1 cs_type_5 cs_bg_filed position-relative"
      style={{
        backgroundImage:
          'url("https://images.prismic.io/rehabana/aYRohd0YXLCxVaQI_hero_bg_3.png?auto=format,compress")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="container position-relative" style={{ zIndex: 1 }}>
        <div className="cs_height_120 cs_height_lg_20" />
        <div className="row cs_gap_y_40 align-items-center">
          <div className="col-lg-6">
            <div className="cs_hero_content">
              {subheading && (
                <h3 className="cs_hero_title_mini cs_fs_14 cs_medium cs_uppercase mb-3">
                  {subheading}
                </h3>
              )}
              {heading?.[0]?.text && (
                <PrismicRichText
                  field={heading}
                  components={createRichTextComponents({
                    heading1ClassName:
                      "cs_hero_title cs_semibold cs_fs_40 mb-4",
                  })}
                />
              )}
              {description?.[0]?.text && (
                <div className="mb-4">
                  <PrismicRichText
                    field={description}
                    components={createRichTextComponents({
                      paragraphClassName:
                        "cs_hero_subtitle cs_fs_16 cs_medium mb-0",
                    })}
                  />
                </div>
              )}
              {listItems.length > 0 && (
                <div className="row" style={{ gap: "10px" }}>
                  {listItems.map((feature, index) => (
                    <div
                      key={index}
                      className="cs_iconbox cs_style_11 d-flex align-items-center"
                      style={{ gap: "10px" }}
                    >
                      <div
                        className="cs_iconbox_icon cs_center cs_radius_50 text-white cs_accent_bg mb-0"
                        style={{
                          width: "32px",
                          height: "32px",
                          minWidth: "32px",
                        }}
                      >
                        <FaCheck style={{ fontSize: "14px" }} />
                      </div>
                      <p className="cs_iconbox_text mb-0 cs_fs_16">{feature}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="col-lg-6">
            <div
              className="cs_appointment_form_wrapper cs_type_1 cs_radius_10 cs_white_bg"
              style={{
                border: "1px solid rgba(0, 0, 0, 0.1)",
              }}
            >
              {/* h2, not h3: it follows the page's h1 directly, and a skipped
                  level is flagged by SEO audits. Size comes from the classes. */}
              {form_title && (
                <h2 className="cs_appointment_heading cs_fs_20 cs_medium mb-4">
                  {form_title}
                </h2>
              )}
              <div style={{ margin: "-20px" }}>
                <OpnFormIframe height="400px" />
              </div>
            </div>
          </div>
        </div>
        <div className="cs_height_120 cs_height_lg_80" />
      </div>
    </section>
  );
};

export default HeroSectionForm;
