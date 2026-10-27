/**
 * Renders a JSON-LD structured data script block safely for search engines.
 *
 * @param {Object} props
 * @param {Record<string, any>} props.data
 */
export function JsonLd({ data }) {
  if (!data) return null;

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}
