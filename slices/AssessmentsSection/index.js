import { AssessmentsSection as Section } from "@/components/assessments-section";

/**
 * @typedef {import("@prismicio/client").Content.AssessmentsSectionSlice} AssessmentsSectionSlice
 * @typedef {import("@prismicio/react").SliceComponentProps<AssessmentsSectionSlice>} AssessmentsSectionProps
 * @type {import("react").FC<AssessmentsSectionProps>}
 */
const AssessmentsSection = ({ slice, context }) => (
  <Section slice={slice} context={context} />
);

export default AssessmentsSection;
