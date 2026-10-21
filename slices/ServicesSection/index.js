import DefaultSection from "@/components/services-section";

/**
 * @typedef {import("@prismicio/client").Content.ServicesSectionSlice} ServicesSectionSlice
 * @typedef {import("@prismicio/react").SliceComponentProps<ServicesSectionSlice>} ServicesSectionProps
 * @type {import("react").FC<ServicesSectionProps>}
 */
const ServicesSection = ({ slice }) => {
  switch (slice.variation) {
    default:
      return <DefaultSection slice={slice} />;
  }
};

export default ServicesSection;
