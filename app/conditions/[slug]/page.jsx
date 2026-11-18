import { notFound } from "next/navigation";
import {
  ConditionPage,
  getConditionMetadata,
} from "@/components/conditions/condition-page";
import {
  CONDITIONS_BASE_PATH,
  findByUrl,
  getConditionTree,
  toUrlSegment,
} from "@/lib/conditions";

const findEntry = (tree, { slug }) =>
  findByUrl(tree, `${CONDITIONS_BASE_PATH}/${slug}`);

/**
 * /conditions/a — a top-level condition page. Its child pages live at the
 * site root (/a/b, /a/b/c), served by app/[slug]/[...rest].
 */
const TopLevelConditionPage = async ({ params }) => {
  const tree = await getConditionTree();
  const entry = findEntry(tree, params);
  if (!entry) notFound();

  return <ConditionPage entry={entry} tree={tree} />;
};

export async function generateStaticParams() {
  const tree = await getConditionTree();
  return tree
    .filter(({ chain }) => chain.length === 1)
    .map(({ doc }) => ({ slug: toUrlSegment(doc.uid) }));
}

export async function generateMetadata({ params }) {
  const entry = findEntry(await getConditionTree(), params);
  return entry ? getConditionMetadata(entry) : {};
}

export default TopLevelConditionPage;
