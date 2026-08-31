import { Helmet } from 'react-helmet-async';

export interface SEOProps {
  title: string;
  description: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'profile';
  keywords?: string;
  schema?: Record<string, any> | Array<Record<string, any>>;
}

export const SEO = ({ 
  title, 
  description, 
  canonicalUrl, 
  ogImage = '/images/logo.png', 
  ogType = 'website',
  keywords,
  schema
}: SEOProps) => {
  const siteTitle = title.includes('Norway SmartLife') 
    ? title 
    : `${title} | Norway SmartLife`;
  
  return (
    <Helmet>
      {/* Standard Metadata */}
      <title>{siteTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* Canonical URL */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

      {/* Schema.org JSON-LD */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(Array.isArray(schema) ? schema : [schema])}
        </script>
      )}
    </Helmet>
  );
};

/**
 * Generates Schema.org TouristDestination structured data
 */
export const generateDestinationSchema = (data: {
  name: string;
  description: string;
  image?: string;
  region?: string;
  latitude?: number;
  longitude?: number;
  url?: string;
}) => ({
  '@context': 'https://schema.org',
  '@type': 'TouristDestination',
  name: data.name,
  description: data.description,
  image: data.image || 'https://norway-smartlife.vercel.app/images/logo.png',
  touristType: ['Eco-Tourism', 'Adventure', 'Nature', 'Culture'],
  containedInPlace: {
    '@type': 'Country',
    name: 'Norway',
  },
  ...(data.latitude && data.longitude ? {
    geo: {
      '@type': 'GeoCoordinates',
      latitude: data.latitude,
      longitude: data.longitude,
    }
  } : {}),
  ...(data.url ? { url: data.url } : {}),
});

/**
 * Generates Schema.org LodgingBusiness / Hotel structured data
 */
export const generateStaySchema = (data: {
  name: string;
  description: string;
  image?: string;
  priceRange?: string;
  address?: string;
  rating?: number;
  reviewCount?: number;
  url?: string;
}) => ({
  '@context': 'https://schema.org',
  '@type': 'LodgingBusiness',
  name: data.name,
  description: data.description,
  image: data.image || 'https://norway-smartlife.vercel.app/images/logo.png',
  priceRange: data.priceRange || 'NOK 1,500 - 5,000',
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'NO',
    streetAddress: data.address || 'Norway',
  },
  ...(data.rating ? {
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: data.rating,
      reviewCount: data.reviewCount || 10,
      bestRating: 5,
    }
  } : {}),
  ...(data.url ? { url: data.url } : {}),
});

/**
 * Generates Schema.org TouristAttraction structured data
 */
export const generateActivitySchema = (data: {
  name: string;
  description: string;
  image?: string;
  priceNok?: number;
  location?: string;
  url?: string;
}) => ({
  '@context': 'https://schema.org',
  '@type': 'TouristAttraction',
  name: data.name,
  description: data.description,
  image: data.image || 'https://norway-smartlife.vercel.app/images/logo.png',
  isAccessibleForFree: data.priceNok === 0,
  ...(data.priceNok ? {
    offers: {
      '@type': 'Offer',
      price: data.priceNok,
      priceCurrency: 'NOK',
      availability: 'https://schema.org/InStock',
    }
  } : {}),
  ...(data.url ? { url: data.url } : {}),
});

/**
 * Generates Schema.org BreadcrumbList structured data
 */
export const generateBreadcrumbSchema = (crumbs: Array<{ name: string; url: string }>) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: crumbs.map((crumb, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: crumb.name,
    item: crumb.url.startsWith('http') ? crumb.url : `https://norway-smartlife.vercel.app${crumb.url}`,
  })),
});
