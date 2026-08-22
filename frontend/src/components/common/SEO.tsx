import React, { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  canonicalUrl?: string;
  schema?: Record<string, any>;
}

export const SEO: React.FC<SEOProps> = ({
  title = 'Norway SmartLife — Premium Travel, Fjord Exploration & Smart Living',
  description = "Discover Norway's majestic fjords, boreal forests, botanical flora, wildlife, eco-stays, aurora forecasts, and smart city services.",
  keywords,
  ogImage = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=norway&w=1200',
  canonicalUrl,
  schema,
}) => {
  useEffect(() => {
    // 1. Update Title
    const formattedTitle = title.includes('Norway SmartLife') 
      ? title 
      : `${title} | Norway SmartLife`;
    document.title = formattedTitle;

    // Helper to update or create meta tags
    const setMetaTag = (attr: string, key: string, content: string) => {
      let meta = document.querySelector(`meta[${attr}="${key}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attr, key);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    // 2. Standard Meta
    setMetaTag('name', 'description', description);
    if (keywords) setMetaTag('name', 'keywords', keywords);

    // 3. Open Graph
    setMetaTag('property', 'og:title', formattedTitle);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:image', ogImage);

    // 4. Twitter Card
    setMetaTag('property', 'twitter:title', formattedTitle);
    setMetaTag('property', 'twitter:description', description);
    setMetaTag('property', 'twitter:image', ogImage);

    // 5. Canonical Link
    const url = canonicalUrl || window.location.href;
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    link.setAttribute('href', url);

    // 6. Schema.org JSON-LD
    let scriptTag = document.getElementById('json-ld-schema') as HTMLScriptElement | null;
    if (schema) {
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.id = 'json-ld-schema';
        scriptTag.type = 'application/ld+json';
        document.head.appendChild(scriptTag);
      }
      scriptTag.text = JSON.stringify(schema);
    } else if (scriptTag) {
      scriptTag.remove();
    }
  }, [title, description, keywords, ogImage, canonicalUrl, schema]);

  return null;
};
