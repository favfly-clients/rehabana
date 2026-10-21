import { PrismicNextImage } from "@prismicio/next";

/**
 * Rich text map for the detail section. Covers headings H2–H6, lists, links and
 * inline images/embeds. Heading 1 renders as H2 so the page keeps one <h1>.
 */
export const detailRichTextComponents = {
  paragraph: ({ children }) => <p className="leading-relaxed">{children}</p>,
  heading1: ({ children }) => <h2>{children}</h2>,
  heading2: ({ children }) => <h2>{children}</h2>,
  heading3: ({ children }) => <h3>{children}</h3>,
  heading4: ({ children }) => <h4>{children}</h4>,
  heading5: ({ children }) => <h5>{children}</h5>,
  heading6: ({ children }) => <h6>{children}</h6>,
  list: ({ children }) => <ul className="list-disc pl-6 my-2">{children}</ul>,
  oList: ({ children }) => <ol className="list-decimal pl-6 my-2">{children}</ol>,
  listItem: ({ children }) => <li className="my-1">{children}</li>,
  oListItem: ({ children }) => <li className="my-1">{children}</li>,
  hyperlink: ({ children, node }) => (
    <a
      href={node.data?.url}
      target={node.data?.target}
      rel={node.data?.target === "_blank" ? "noopener noreferrer" : undefined}
      className="paragraph-link"
    >
      {children}
    </a>
  ),
  strong: ({ children }) => <strong className="cs_semibold">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
  image: ({ node }) => {
    if (!node?.url) return null;

    return (
      <PrismicNextImage
        field={node}
        className="img-fluid cs_radius_10 my-4"
        sizes="(max-width: 991px) 100vw, 66vw"
      />
    );
  },
  embed: ({ node }) => {
    if (!node.oembed?.html) return null;

    return (
      <div
        className="iframe-container my-4"
        dangerouslySetInnerHTML={{ __html: node.oembed.html }}
      />
    );
  },
};
