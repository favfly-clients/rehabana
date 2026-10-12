import React from "react";

/**
 * Prismic web links must be absolute, so a link to our own page is stored as
 * https://rehabana.com/... — render it site-relative so it stays on the
 * current host (localhost, previews) instead of jumping to production.
 */
const OWN_ORIGIN = /^https?:\/\/(www\.)?rehabana\.com(?=\/|$)/i;
const toHref = (url) => (url ? url.replace(OWN_ORIGIN, "") || "/" : url);

/**
 * Creates a PrismicRichText components map so all HTML tags (paragraph, headings, lists, links)
 * are rendered with explicit components and optional classNames.
 *
 * @param {Object} options
 * @param {string} [options.paragraphClassName='leading-relaxed'] - Class for <p>
 * @param {string} [options.heading1ClassName='font-bold text-4xl'] - Class for <h1>
 * @param {string} [options.heading2ClassName='font-bold text-xl'] - Class for <h2>
 * @param {string} [options.heading3ClassName='font-bold text-lg'] - Class for <h3>
 * @param {string} [options.listClassName='list-disc pl-6 my-2'] - Class for <ul>
 * @param {string} [options.oListClassName='list-decimal pl-6 my-2'] - Class for <ol>
 * @param {string} [options.listItemClassName='my-1'] - Class for <li>
 * @param {string} [options.hyperlinkClassName='font-bold underline'] - Class for <a>
 * @param {string} [options.strongClassName='font-bold'] - Class for <strong>
 * @param {string} [options.emClassName='italic'] - Class for <em>
 */
export function createRichTextComponents({
  paragraphClassName = "leading-relaxed",
  heading1ClassName = "font-bold text-4xl",
  heading2ClassName = "font-bold text-xl",
  heading3ClassName = "font-bold text-lg",
  listClassName = "list-disc pl-6 my-2",
  oListClassName = "list-decimal pl-6 my-2",
  listItemClassName = "my-1",
  hyperlinkClassName = "paragraph-link",
  strongClassName = "cs_semibold",
  emClassName = "italic",
} = {}) {
  return {
    paragraph: ({ children }) => (
      <p className={paragraphClassName}>{children}</p>
    ),
    heading1: ({ children }) => (
      <h1 className={heading1ClassName}>{children}</h1>
    ),
    heading2: ({ children }) => (
      <h2 className={heading2ClassName}>{children}</h2>
    ),
    heading3: ({ children }) => (
      <h3 className={heading3ClassName}>{children}</h3>
    ),
    list: ({ children }) => <ul className={listClassName}>{children}</ul>,
    oList: ({ children }) => <ol className={oListClassName}>{children}</ol>,
    listItem: ({ children }) => (
      <li className={listItemClassName}>{children}</li>
    ),
    hyperlink: ({ children, node }) => (
      <a href={toHref(node.data?.url)} className={hyperlinkClassName}>
        {children}
      </a>
    ),
    strong: ({ children }) => (
      <strong className={strongClassName}>{children}</strong>
    ),
    em: ({ children }) => <em className={emClassName}>{children}</em>,
    label: ({ node, children }) => {
      if (node.data?.label === "codespan") {
        return (
          <code className="px-1 py-0.5 rounded bg-gray-100 text-sm">
            {children}
          </code>
        );
      }
      return <span>{children}</span>;
    },
  };
}
