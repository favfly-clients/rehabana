import { createClient } from "@/prismicio";
import { components } from "@/slices";
import { SliceZoneWithContext } from "@/lib/SliceZoneWithContext";
import Seo from "@/lib/seo/Seo";
import { notFound } from "next/navigation";
import BlogPost from "@/components/blog-post";
import BlogsSection from "@/components/blogs-section";
import SchemaMarkup from "@/components/schema-markup";
import { asText } from "@prismicio/client";
import {
  generateBreadcrumbSchema,
  generateArticleSchema,
} from "@/lib/schema-data";
import { buildServiceSchemas, findKnownService } from "@/lib/service-schema";

const AUTHOR_FETCH_LINKS = ["author.name", "author.image", "author.designation"];

const CustomPage = async ({ params }) => {
  const client = createClient();

  const [custom, blog, { results: blogs }, blogsSection] = await Promise.all([
    client.getByUID("custom_page", params.slug).catch(() => null),
    client
      .getByUID("blog_post", params.slug, { fetchLinks: AUTHOR_FETCH_LINKS })
      .catch(() => null),
    client.getByType("blog_post", {
      orderings: {
        field: "my.blog_post.published_date",
        direction: "desc",
      },
      pageSize: 3,
      fetchLinks: AUTHOR_FETCH_LINKS,
    }),
    // Same blogs section as home page: config + recent posts
    client.getSingle("blogs"),
  ]);

  if (custom === null && blog === null) {
    notFound();
  }

  if (custom) {
    // The former service pages live here as custom pages at the same URL;
    // they keep their service schema and the blogs section they always had.
    const path = `/${params.slug}`;
    const isService = Boolean(findKnownService(path));

    return (
      <>
        {isService && <SchemaMarkup data={buildServiceSchemas(path, custom)} />}
        <SliceZoneWithContext
          slices={custom.data.slices}
          components={components}
          context={{ blogs, blogSlice: blogsSection.data }}
        />
        {isService && (
          <BlogsSection slice={{ primary: blogsSection.data }} blogs={blogs} />
        )}
      </>
    );
  }

  const postUrl = `https://rehabana.com/${params.slug}`;
  const blogTitle = asText(blog.data.title);

  const articleBreadcrumb = generateBreadcrumbSchema([
    { name: "Home", url: "https://rehabana.com" },
    { name: "Blog", url: "https://rehabana.com/blog" },
    { name: blogTitle, url: postUrl },
  ]);

  const articleSchema = generateArticleSchema({
    title: blogTitle,
    description: blog.data.meta_description || asText(blog.data.description),
    url: postUrl,
    image: blog.data.featured_image?.url || blog.data.image?.url || "",
    datePublished: blog.data.published_date,
    dateModified: blog.data.last_publication_date,
  });

  return (
    <>
      <SchemaMarkup data={[articleBreadcrumb, articleSchema]} />
      <BlogPost data={blog.data} />
      <BlogsSection slice={{ primary: blogsSection.data }} blogs={blogs} />
    </>
  );
};

export async function generateStaticParams() {
  const client = createClient();

  const [blogs, custom] = await Promise.all([
    client.getAllByType("blog_post"),
    client.getAllByType("custom_page"),
  ]);

  return [...blogs, ...custom].map((item) => ({
    slug: item.uid,
  }));
}

export async function generateMetadata({ params }) {
  const client = createClient();

  const [blog, custom] = await Promise.all([
    client.getByUID("blog_post", params.slug).catch(() => null),
    client.getByUID("custom_page", params.slug).catch(() => null),
  ]);

  if (blog === null && custom === null) {
    notFound();
  }

  return Seo(blog || custom);
}

export default CustomPage;
