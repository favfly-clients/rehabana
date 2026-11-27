import { createClient } from "@/prismicio";
import { components } from "@/slices";
import { SliceZoneWithContext } from "@/lib/SliceZoneWithContext";
import Seo from "@/lib/seo/Seo";
import BlogsSection from "@/components/blogs-section";
import SchemaMarkup from "@/components/schema-markup";
import {
  generateBreadcrumbSchema,
  generateFaqSchemaFromSlices,
  generateWebPageSchema,
} from "@/lib/schema-data";

const HomePage = async () => {
  const client = createClient();

  const doc = await client.getSingle("home_page");
  const blogsSection = await client.getSingle("blogs");
  const blogs = await client.getByType("blog_post", {
    orderings: {
      field: "my.blog_post.published_date",
      direction: "desc",
    },
    pageSize: 3,
    fetchLinks: ["author.name", "author.image", "author.designation"],
  });

  const homeBreadcrumb = generateBreadcrumbSchema([
    { name: "Home", url: "https://rehabana.com" },
  ]);

  const homeWebPage = generateWebPageSchema({
    name: "Best Neuro Rehabilitation Centre in Kolkata | Rehabana",
    description:
      "Rehabana is a PMR MD doctor-led Neuro Rehabilitation Center in Kolkata for stroke, spinal cord injury, Parkinson's and more.",
    url: "https://rehabana.com",
  });

  // Built from the FAQ slice itself, so the FAQPage markup always carries the
  // same questions, answers and phone numbers as the accordion on screen.
  const homeFaq = generateFaqSchemaFromSlices(doc.data.slices);

  return (
    <>
      <SchemaMarkup
        data={[homeBreadcrumb, homeWebPage, homeFaq].filter(Boolean)}
      />
      <SliceZoneWithContext
        slices={doc.data.slices}
        components={components}
        context={{
          blogSlice: blogsSection.data,
          blogs: blogs.results,
        }}
      />
      <BlogsSection
        slice={{ primary: blogsSection.data }}
        blogs={blogs.results}
      />
    </>
  );
};

export async function generateMetadata() {
  const client = createClient();

  const page = await client.getSingle("home_page");

  return Seo(page);
}

export default HomePage;


