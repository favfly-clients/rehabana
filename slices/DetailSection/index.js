import DetailSection from "@/components/detail-section";

/**
 * @typedef {import("@prismicio/client").Content.DetailSectionSlice} DetailSectionSlice
 * @typedef {import("@prismicio/react").SliceComponentProps<DetailSectionSlice>} DetailSectionProps
 * @type {import("react").FC<DetailSectionProps>}
 */
const DetailSectionSlice = ({ slice }) => <DetailSection slice={slice} />;

export default DetailSectionSlice;
