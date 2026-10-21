import { ConditionsSection as Section } from "@/components/conditions-section";

/**
 * @typedef {import("@prismicio/client").Content.ConditionsSectionSlice} ConditionsSectionSlice
 * @typedef {import("@prismicio/react").SliceComponentProps<ConditionsSectionSlice>} ConditionsSectionProps
 * @type {import("react").FC<ConditionsSectionProps>}
 */
const ConditionsSection = ({ slice, context }) => (
  <Section slice={slice} context={context} />
);

export default ConditionsSection;
