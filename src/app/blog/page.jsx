import { constructMetadata } from "@/lib/seo";
import { generateBreadcrumbSchema, generateBlogIndexSchema } from "@/lib/structured-data";
import { getPublishedArticles, getFeaturedArticle, getCategoriesWithCounts } from "@/lib/blog";
import { BLOG_HERO_CONTENT } from "@/config/blog";
import { Container } from "@/components/layout/Container";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { BlogHero } from "@/components/blog/BlogHero";
import { BlogIndexClient } from "@/components/blog/BlogIndexClient";

export const metadata = constructMetadata({
  title: BLOG_HERO_CONTENT.headline,
  description: BLOG_HERO_CONTENT.description,
  path: "/blog",
  noIndex: false,
  image: "/images/blog/ore-distribution-strata.svg",
  imageAlt: BLOG_HERO_CONTENT.headline,
});

export default function BlogIndexPage() {
  const publishedArticles = getPublishedArticles();
  const featuredArticle = getFeaturedArticle();
  const categories = getCategoriesWithCounts();

  const breadcrumbSchema = generateBreadcrumbSchema([
    { label: "Home", href: "/" },
    { label: "Blog", href: "/blog" },
  ]);
  const blogSchema = generateBlogIndexSchema(publishedArticles);

  return (
    <div className="py-10 sm:py-16">
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={blogSchema} />

      <Container>
        <Breadcrumbs items={[{ label: "Blog" }]} />

        <div className="mt-6">
          <BlogHero totalPublished={publishedArticles.length} />
        </div>

        <BlogIndexClient
          publishedArticles={publishedArticles}
          featuredArticle={featuredArticle}
          categories={categories}
        />
      </Container>
    </div>
  );
}
