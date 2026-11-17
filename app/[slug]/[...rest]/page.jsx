import { notFound } from "next/navigation";
import {
  ConditionPage,
  getConditionMetadata,
} from "@/components/conditions/condition-page";
import { findByUrl, getConditionTree } from "@/lib/conditions";

const MIN_NESTED_DEPTH = 2;

const findEntry = (tree, { slug, rest }) =>
  findByUrl(tree, `/${[slug, ...rest].join("/")}`);

/**
 * /a/b[/c] — a level 2 or 3 condition page, served from the site root.
 * Level 1 lives at /conditions/a (app/conditions/[slug]).
 */
const NestedConditionPage = async ({ params }) => {
  const tree = await getConditionTree();
  const entry = findEntry(tree, params);
  if (!entry) notFound();

  return <ConditionPage entry={entry} tree={tree} />;
};

export async function generateStaticParams() {
  const tree = await getConditionTree();
  return tree
    .filter(({ chain }) => chain.length >= MIN_NESTED_DEPTH)
    .map(({ chain: [root, ...rest] }) => ({
      slug: root.uid,
      rest: rest.map((item) => item.uid),
    }));
}

export async function generateMetadata({ params }) {
  const entry = findEntry(await getConditionTree(), params);
  return entry ? getConditionMetadata(entry) : {};
}

export default NestedConditionPage;
