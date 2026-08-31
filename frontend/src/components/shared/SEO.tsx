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
  canonicalUrl = 'https://norway-smartlife.vercel.app/', 
  ogImage = 'https://norway-smartlife.vercel.app/og-image.jpg', 
  ogType = 'website',
  keywords,
  schema
}: SEOProps) => {
  const siteTitle = title.includes('Norway SmartLife') 
    ? title 
    : `${title} | Norway SmartLife`;

  const absoluteImageUrl = ogImage.startsWith('http') 
    ? ogImage 
    : `https://norway-smartlife.vercel.app${ogImage.startsWith('/') ? '' : '/'}${ogImage}`;
  
  return (
    <Helmet>
      {/* Standard Metadata */}
      <title>{siteTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      
      {/* Open Graph / Facebook / WhatsApp / LinkedIn */}
      <meta property="og:site_name" content="Norway SmartLife" />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={absoluteImageUrl} />
      <meta property="og:image:secure_url" content={absoluteImageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={siteTitle} />
      
      {/* Twitter / X */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={absoluteImageUrl} />
      <meta name="twitter:image:alt" content={siteTitle} />
      
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
  image: data.image,
  containedInPlace: {
    '@type': 'AdministrativeArea',
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
 * Generates Schema.org LodgingBusiness structured data
 */
export const generateStaySchema = (data: {
  name: string;
  description: string;
  image?: string;
  priceRange?: string;
  address?: string;
  rating?: number;
  reviewCount?: number;
}) => ({
  '@context': 'https://schema.org',
  '@type': 'LodgingBusiness',
  name: data.name,
  description: data.description,
  image: data.image,
  priceRange: data.priceRange || '$$$',
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'NO',
    streetAddress: data.address || 'Norway',
  },
  ...(data.rating ? {
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: data.rating,
      reviewCount: data.reviewCount || 1,
    }
  } : {}),
});

export const generateAccommodationSchema = generateStaySchema;

/**
 * Generates Schema.org TouristAttraction structured data
 */
export const generateActivitySchema = (data: {
  name: string;
  description: string;
  priceNok?: number;
  image?: string;
}) => ({
  '@context': 'https://schema.org',
  '@type': 'TouristAttraction',
  name: data.name,
  description: data.description,
  ...(data.priceNok !== undefined ? {
    offers: {
      '@type': 'Offer',
      price: data.priceNok,
      priceCurrency: 'NOK',
      availability: 'https://schema.org/InStock',
    }
  } : {}),
  ...(data.image ? { image: data.image } : {}),
});

/**
 * Generates Schema.org BreadcrumbList structured data
 */
export const generateBreadcrumbSchema = (items: Array<{ name: string; url: string }>) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.url.startsWith('http') 
      ? item.url 
      : `https://norway-smartlife.vercel.app${item.url.startsWith('/') ? '' : '/'}${item.url}`,
  })),
});

/**
 * Generates Schema.org Restaurant structured data
 */
export const generateRestaurantSchema = (data: {
  name: string;
  description: string;
  image?: string;
  servesCuisine?: string;
  priceRange?: string;
  address?: string;
  rating?: number;
}) => ({
  '@context': 'https://schema.org',
  '@type': 'Restaurant',
  name: data.name,
  description: data.description,
  image: data.image,
  servesCuisine: data.servesCuisine || 'Nordic',
  priceRange: data.priceRange || '$$$',
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'NO',
    streetAddress: data.address || 'Norway',
  },
  ...(data.rating ? {
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: data.rating,
    }
  } : {}),
});

/**
 * Generates Schema.org Event structured data
 */
export const generateEventSchema = (data: {
  name: string;
  description: string;
  startDate: string;
  endDate?: string;
  image?: string;
  location?: string;
  price?: number;
  currency?: string;
}) => ({
  '@context': 'https://schema.org',
  '@type': 'Event',
  name: data.name,
  description: data.description,
  startDate: data.startDate,
  ...(data.endDate ? { endDate: data.endDate } : {}),
  image: data.image,
  location: {
    '@type': 'Place',
    name: data.location || 'Norway',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'NO',
    },
  },
  ...(data.price ? {
    offers: {
      '@type': 'Offer',
      price: data.price,
      priceCurrency: data.currency || 'NOK',
      availability: 'https://schema.org/InStock',
    }
  } : {}),
});
