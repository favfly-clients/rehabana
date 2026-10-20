import { createClient } from "@/prismicio";
import { components } from "@/slices";
import { SliceZoneWithContext } from "@/lib/SliceZoneWithContext";
import Seo from "@/lib/seo/Seo";
import { notFound } from "next/navigation";
import BlogsSection from "@/components/blogs-section";
import SchemaMarkup from "@/components/schema-markup";
import { buildServiceSchemas } from "@/lib/service-schema";

const SERVICES_PATH = "/services";

const ServicePage = async ({ params }) => {
  const client = createClient();

  const [service, { results: blogs }, blogsSection] = await Promise.all([
    client.getByUID("service_page", params.slug).catch(() => null),
    client.getByType("blog_post", {
      orderings: {
        field: "my.blog_post.published_date",
        direction: "desc",
      },
      pageSize: 3,
      fetchLinks: ["author.name", "author.image", "author.designation"],
    }),
    client.getSingle("blogs"),
  ]);

  if (!service) {
    notFound();
  }

  const schemas = buildServiceSchemas(`${SERVICES_PATH}/${params.slug}`, service);

  return (
    <>
      <SchemaMarkup data={schemas} />
      <SliceZoneWithContext
        slices={service.data.slices}
        components={components}
        context={{ blogs, blogSlice: blogsSection.data }}
      />
      <BlogsSection slice={{ primary: blogsSection.data }} blogs={blogs} />
    </>
  );
};

export async function generateStaticParams() {
  const client = createClient();
  const services = await client.getAllByType("service_page");

  return services.map((item) => ({ slug: item.uid }));
}

export async function generateMetadata({ params }) {
  const client = createClient();
  const service = await client
    .getByUID("service_page", params.slug)
    .catch(() => null);

  if (!service) {
    notFound();
  }

  return Seo(service);
}

export default ServicePage;
