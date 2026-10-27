import { notFound } from "next/navigation";
import { constructMetadata } from "@/lib/seo";
import { generateArticleSchema, generateBreadcrumbSchema } from "@/lib/structured-data";
import {
  getPublishedArticles,
  getPublishedArticleBySlug,
  getRelatedPublishedArticles,
} from "@/lib/blog";
import { JsonLd } from "@/components/seo/JsonLd";
import { ArticleLayout } from "@/components/blog/ArticleLayout";

/**
 * Prerenders only published article slugs at build time for Next.js 16 Cache Components.
 * Draft articles are excluded from static route generation and public discovery.
 */
export function generateStaticParams() {
  return getPublishedArticles().map((article) => ({
    slug: article.slug,
  }));
}

/**
 * Generates dynamic SEO metadata per published blog article (Section 10).
 */
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const article = getPublishedArticleBySlug(slug);

  if (!article) {
    return constructMetadata({
      title: "Guide Not Found",
      path: `/blog/${slug}`,
      noIndex: true,
    });
  }

  return constructMetadata({
    title: article.title,
    description: article.description || article.excerpt,
    path: `/blog/${article.slug}`,
    noIndex: article.status !== "published",
    type: "article",
    publishedTime: article.publishedAt,
    modifiedTime: article.updatedAt,
    image: article.image,
    imageAlt: article.imageAlt || article.title,
    tags: article.tags,
  });
}

export default async function BlogArticlePage({ params }) {
  const { slug } = await params;
  const article = getPublishedArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const relatedArticles = getRelatedPublishedArticles(article);
  const articleSchema = generateArticleSchema(article);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { label: "Home", href: "/" },
    { label: "Blog", href: "/blog" },
    { label: article.title, href: `/blog/${article.slug}` },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={articleSchema} />
      <ArticleLayout article={article} relatedArticles={relatedArticles} />
    </>
  );
}
