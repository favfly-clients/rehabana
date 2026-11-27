import { createClient } from "@/prismicio";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import Link from "next/link";
import * as prismic from "@prismicio/client";
import { PrismicNextImage, PrismicNextLink } from "@prismicio/next";
import { PrismicRichText } from "@prismicio/react";
import { createRichTextComponents } from "@/lib/richTextComponents";

const AUTHOR_FETCH_LINKS = ["author.name", "author.image", "author.designation"];

const SITE_NAME = "Rehabana";
const TITLE_MAX = 60;
const DESCRIPTION_MAX = 155;

/** Cuts `text` at a word boundary so it fits in `max` characters. */
const clip = (text, max) => {
  const clean = (text || "").replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(" ")).replace(/[\s,;:.–-]+$/, "")}…`;
};

/**
 * "Name, Designation | Rehabana", falling back to the designation's first
 * part ("Consultant Physiatrist | Neuro, …" -> "Consultant Physiatrist") and
 * then to "Name | Rehabana", so every author page has a unique title that
 * fits in a search result.
 */
const authorTitle = (name, designation) => {
  const candidates = [
    designation && `${name}, ${designation.trim()} | ${SITE_NAME}`,
    designation && `${name}, ${designation.split("|")[0].trim()} | ${SITE_NAME}`,
    `${name} | ${SITE_NAME}`,
  ].filter(Boolean);
  return candidates.find((title) => title.length <= TITLE_MAX) ?? candidates.at(-1);
};

/** The bio, or a plain sentence built from name and designation. */
const authorDescription = (name, designation, bio) =>
  clip(
    prismic.asText(bio) ||
      `${name}${designation ? `, ${designation}` : ""} at Rehabana Neuro Rehab Center, Kolkata. Read articles by ${name}.`,
    DESCRIPTION_MAX,
  );

const uniqueById = (docs = []) => {
  const seen = new Set();
  return docs.filter((doc) => {
    if (!doc?.id) return false;
    if (seen.has(doc.id)) return false;
    seen.add(doc.id);
    return true;
  });
};

const AuthorPage = async ({ params }) => {
  const client = createClient();
  const uid = params?.uid || "";

  const author = await client.getByUID("author", uid).catch(() => null);
  if (!author) notFound();

  const legacyBlogsPromise = client
    .getAllByType("blog_post", {
      filters: [prismic.filter.at("my.blog_post.author", author.id)],
      orderings: {
        field: "my.blog_post.published_date",
        direction: "desc",
      },
      fetchLinks: AUTHOR_FETCH_LINKS,
    })
    .catch(() => []);

  const groupBlogsPromise = client
    .getAllByType("blog_post", {
      filters: [prismic.filter.any("my.blog_post.authors.author", [author.id])],
      orderings: {
        field: "my.blog_post.published_date",
        direction: "desc",
      },
      fetchLinks: AUTHOR_FETCH_LINKS,
    })
    .catch(() => []);

  const [legacyBlogs, groupBlogs] = await Promise.all([
    legacyBlogsPromise,
    groupBlogsPromise,
  ]);

  const blogs = uniqueById([...legacyBlogs, ...groupBlogs]).sort((a, b) => {
    const aDate = a?.data?.published_date
      ? new Date(a.data.published_date).getTime()
      : 0;
    const bDate = b?.data?.published_date
      ? new Date(b.data.published_date).getTime()
      : 0;
    return bDate - aDate;
  });

  const { name, image, designation, bio } = author.data || {};

  return (
    <div className="cs_gray_bg">
      <div className="cs_height_120 cs_height_lg_80" />
      <div className="container">
        <div className="cs_white_bg cs_radius_10 p-4 p-md-5 mb-4">
          <div className="row align-items-center cs_gap_y_20">
            <div className="col-md-3">
              <PrismicNextImage
                field={image}
                alt={name || author.uid}
                className="img-fluid cs_radius_8"
                style={{ width: "100%", aspectRatio: "1/1", objectFit: "cover" }}
              />
            </div>
            <div className="col-md-9">
              <h1 className="cs_fs_32 cs_semibold mb-2 cs_accent_color">
                {name}
              </h1>
              {designation && (
                <div className="cs_post_meta mb-3 cs_accent_color">
                  {designation}
                </div>
              )}
              {bio ? (
                <PrismicRichText
                  field={bio}
                  components={createRichTextComponents({
                    paragraphClassName: "mb-2",
                  })}
                />
              ) : null}
            </div>
          </div>
        </div>

        <div className="cs_white_bg cs_radius_10 p-4 p-md-5">
          <h2 className="cs_fs_24 cs_semibold mb-4">Blogs by {name}</h2>

          {blogs.length === 0 ? (
            <p className="mb-0">No blogs published yet.</p>
          ) : (
            <div className="row cs_row_gap_30 cs_gap_y_40">
              {blogs.map((doc) => (
                <div key={doc.id} className="col-lg-4">
                  <article className="cs_post cs_style_1">
                    <PrismicNextLink
                      href={doc.url}
                      className="cs_post_thumbnail cs_radius_8"
                    >
                      <PrismicNextImage
                        field={doc.data.featured_image}
                        alt={doc.data.meta_title}
                        className="img-fluid"
                        style={{ aspectRatio: "16/9", objectFit: "cover" }}
                      />
                    </PrismicNextLink>
                    <div className="cs_post_info">
                      <div className="cs_post_meta">
                        {doc.data?.published_date
                          ? format(
                              new Date(doc.data.published_date),
                              "MMM d, yyyy"
                            )
                          : ""}
                      </div>
                      <PrismicNextLink href={doc.url}>
                        <h3 className="cs_post_title cs_fs_20 cs_semibold">
                          {doc.data.meta_title}
                        </h3>
                      </PrismicNextLink>

                      <p className="cs_post_excerpt mb-0">
                        {doc.data.meta_description}
                      </p>
                    </div>
                  </article>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="cs_height_20" />
        <Link href="/blog" className="cs_text_btn cs_fs_16 cs_heading_color">
          Back to Blog
        </Link>
      </div>
      <div className="cs_height_120 cs_height_lg_80" />
    </div>
  );
};

export async function generateMetadata({ params }) {
  const client = createClient();
  const author = await client.getByUID("author", params?.uid || "").catch(() => null);
  if (!author) notFound();

  const { name, designation, bio, image } = author.data || {};
  const displayName = name || author.uid;
  const title = authorTitle(displayName, designation);
  const description = authorDescription(displayName, designation, bio);
  const path = `/authors/${author.uid}`;

  return {
    // `absolute`: the title already ends in "| Rehabana".
    title: { absolute: title },
    description,
    metadataBase: new URL(`https://${process.env.PRISMIC_ID}.${process.env.TLD}`),
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      siteName: process.env.PRISMIC_ID,
      type: "profile",
      ...(image?.url && { images: [{ url: image.url, alt: image.alt || displayName }] }),
      locale: "en_US",
    },
  };
}

export default AuthorPage;
