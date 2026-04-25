import { useEffect } from 'react';

const upsertMeta = (name, content, attribute = 'name') => {
  let element = document.head.querySelector(`meta[${attribute}="${name}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, name);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
};

export default function usePageSeo({ title, description, canonicalPath }) {
  useEffect(() => {
    if (title) {
      document.title = `${title} | ImageToPDFNow`;
      upsertMeta('og:title', `${title} | ImageToPDFNow`, 'property');
      upsertMeta('twitter:title', `${title} | ImageToPDFNow`);
    }

    if (description) {
      upsertMeta('description', description);
      upsertMeta('og:description', description, 'property');
      upsertMeta('twitter:description', description);
    }

    if (canonicalPath) {
      const canonicalUrl = `${window.location.origin}${canonicalPath}`;
      let canonical = document.head.querySelector('link[rel="canonical"]');
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        document.head.appendChild(canonical);
      }
      canonical.setAttribute('href', canonicalUrl);
      upsertMeta('og:url', canonicalUrl, 'property');
    }
  }, [title, description, canonicalPath]);
}
