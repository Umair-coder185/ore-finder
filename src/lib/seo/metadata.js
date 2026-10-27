import { siteConfig } from "../../config/site.js";

/**
 * Generates standardized Next.js App Router metadata objects with canonical URLs,
 * Open Graph tags (including OG images and article timestamps), and explicit indexing controls.
 *
 * @param {Object} options
 * @param {string} [options.title]
 * @param {string} [options.description]
 * @param {string} [options.path="/"]
 * @param {boolean} [options.noIndex=false]
 * @param {"website" | "article"} [options.type="website"]
 * @param {string} [options.publishedTime]
 * @param {string} [options.modifiedTime]
 * @param {string} [options.image]
 * @param {string} [options.imageAlt]
 * @param {string[]} [options.tags]
 * @returns {import("next").Metadata}
 */
export function constructMetadata({
  title,
  description = siteConfig.description,
  path = "/",
  noIndex = false,
  type = "website",
  publishedTime,
  modifiedTime,
  image,
  imageAlt,
  tags,
} = {}) {
  const canonicalUrl = new URL(path, siteConfig.url).toString();
  const fullTitle = title
    ? `${title} | ${siteConfig.name}`
    : `${siteConfig.name} — ${siteConfig.tagline}`;

  const imageUrl = image ? new URL(image, siteConfig.url).toString() : null;

  return {
    title: fullTitle,
    description,
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: fullTitle,
      description,
      url: canonicalUrl,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type,
      ...(publishedTime ? { publishedTime } : {}),
      ...(modifiedTime ? { modifiedTime } : {}),
      ...(Array.isArray(tags) && tags.length > 0 ? { tags } : {}),
      ...(imageUrl
        ? {
            images: [
              {
                url: imageUrl,
                width: 1200,
                height: 630,
                alt: imageAlt || fullTitle,
              },
            ],
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      ...(imageUrl ? { images: [imageUrl] } : {}),
    },
    robots: noIndex
      ? {
          index: false,
          follow: true,
          googleBot: {
            index: false,
            follow: true,
          },
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        },
  };
}
