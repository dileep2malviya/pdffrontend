import { useEffect, useRef } from 'react';
import { injectSchemaTag, removeSchemaTag, getMetaDescription } from '../Utils/seoUtils';

const upsertMeta = (name, content, attribute = 'name') => {
  let element = document.head.querySelector(`meta[${attribute}="${name}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, name);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
};

export default function usePageSeo({ 
  title, 
  description, 
  canonicalPath,
  schema = null,
  keywords = null,
  ogImage = null,
  twitterCard = 'summary_large_image'
}) {
  const schemaTagIdRef = useRef(null);

  useEffect(() => {
    // Update title
    if (title) {
      const fullTitle = `${title} | ImageToPDFNow`;
      document.title = fullTitle;
      upsertMeta('og:title', fullTitle, 'property');
      upsertMeta('twitter:title', fullTitle);
    }

    // Update description with proper length
    if (description) {
      const metaDescription = getMetaDescription(description, 160);
      upsertMeta('description', metaDescription);
      upsertMeta('og:description', metaDescription, 'property');
      upsertMeta('twitter:description', metaDescription);
    }

    // Update keywords if provided
    if (keywords) {
      upsertMeta('keywords', keywords);
    }

    // Update canonical URL
    if (canonicalPath) {
      const baseUrl = window.location.origin;
      const canonicalUrl = `${baseUrl}${canonicalPath}`;
      let canonical = document.head.querySelector('link[rel="canonical"]');
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        document.head.appendChild(canonical);
      }
      canonical.setAttribute('href', canonicalUrl);
      upsertMeta('og:url', canonicalUrl, 'property');
    }

    // Update OG image
    if (ogImage) {
      upsertMeta('og:image', ogImage, 'property');
      upsertMeta('twitter:image', ogImage);
    }

    // Update Twitter card type
    upsertMeta('twitter:card', twitterCard);

    // Inject structured data schema
    if (schema) {
      // Remove previous schema if exists
      if (schemaTagIdRef.current) {
        removeSchemaTag(schemaTagIdRef.current);
      }
      
      // Inject new schema
      schemaTagIdRef.current = injectSchemaTag(schema);
    }

    // Cleanup on unmount
    return () => {
      if (schemaTagIdRef.current) {
        removeSchemaTag(schemaTagIdRef.current);
      }
    };
  }, [title, description, canonicalPath, schema, keywords, ogImage, twitterCard]);
}
