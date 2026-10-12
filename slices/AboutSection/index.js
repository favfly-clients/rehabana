import DefaultSection from "@/components/about-section";
import FullImageAboutSection from "@/components/about-section/full-image";

/**
 * @typedef {import("@prismicio/client").Content.AboutSectionSlice} AboutSectionSlice
 * @typedef {import("@prismicio/react").SliceComponentProps<AboutSectionSlice>} AboutSectionProps
 * @type {import("react").FC<AboutSectionProps>}
 */
const AboutSection = ({ slice }) => {
  switch (slice.variation) {
    case "full_image":
      return <FullImageAboutSection slice={slice} />;
    default:
      return <DefaultSection slice={slice} />;
  }
};

export default AboutSection;
