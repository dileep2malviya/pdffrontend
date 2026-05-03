/**
 * SEO utilities for generating structured data and meta tags
 */

export const generateToolSchema = (tool, baseUrl = 'https://www.imagetopdfnow.com') => {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: tool.name,
    description: tool.description,
    url: `${baseUrl}/tools/${tool.slug}`,
    applicationCategory: 'Productivity',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD'
    }
  };
};

export const generateBreadcrumbSchema = (breadcrumbs, baseUrl = 'https://www.imagetopdfnow.com') => {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: `${baseUrl}${item.path}`
    }))
  };
};

export const generateFAQSchema = (faqs) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };
};

export const generateArticleSchema = (article, baseUrl = 'https://www.imagetopdfnow.com') => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    url: `${baseUrl}${article.path}`,
    datePublished: article.publishDate,
    dateModified: article.modifiedDate,
    author: {
      '@type': 'Organization',
      name: 'ImageToPDFNow'
    },
    publisher: {
      '@type': 'Organization',
      name: 'ImageToPDFNow',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo512.png`
      }
    }
  };
};

export const injectSchemaTag = (schema) => {
  if (typeof document === 'undefined') return;
  
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(schema);
  script.id = `schema-${Date.now()}`;
  document.head.appendChild(script);
  
  return script.id;
};

export const removeSchemaTag = (tagId) => {
  if (typeof document === 'undefined') return;
  
  const tag = document.getElementById(tagId);
  if (tag) tag.remove();
};

export const updateCanonical = (path, baseUrl = 'https://www.imagetopdfnow.com') => {
  if (typeof document === 'undefined') return;
  
  let canonicalTag = document.querySelector('link[rel="canonical"]');
  
  if (!canonicalTag) {
    canonicalTag = document.createElement('link');
    canonicalTag.rel = 'canonical';
    document.head.appendChild(canonicalTag);
  }
  
  canonicalTag.href = `${baseUrl}${path}`;
};

export const updateOpenGraph = (og = {}) => {
  if (typeof document === 'undefined') return;
  
  const defaults = {
    'og:url': 'https://www.imagetopdfnow.com',
    'og:type': 'website',
    'og:title': 'ImageToPDFNow | Free Online PDF Tools',
    'og:description': 'Convert, merge, split, and edit PDFs online for free',
    'og:image': 'https://www.imagetopdfnow.com/logo512.png'
  };
  
  const merged = { ...defaults, ...og };
  
  Object.entries(merged).forEach(([property, content]) => {
    let meta = document.querySelector(`meta[property="${property}"]`);
    
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('property', property);
      document.head.appendChild(meta);
    }
    
    meta.content = content;
  });
};

export const getMetaDescription = (text, maxLength = 160) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
};
