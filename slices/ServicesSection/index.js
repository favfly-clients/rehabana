import DefaultSection from "@/components/services-section";
import { ConditionsSection } from "@/components/services-section/conditions-section";

/**
 * @typedef {import("@prismicio/client").Content.ServicesSectionSlice} ServicesSectionSlice
 * @typedef {import("@prismicio/react").SliceComponentProps<ServicesSectionSlice>} ServicesSectionProps
 * @type {import("react").FC<ServicesSectionProps>}
 */
const ServicesSection = ({ slice, context }) => {
  switch (slice.variation) {
    case "conditions":
      return <ConditionsSection slice={slice} context={context} />;
    default:
      return <DefaultSection slice={slice} />;
  }
};

export default ServicesSection;
