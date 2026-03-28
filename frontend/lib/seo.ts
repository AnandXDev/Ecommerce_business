// SEO utilities and metadata generation

export interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'product' | 'article';
  locale?: string;
  siteName?: string;
  noindex?: boolean;
  canonical?: string;
  jsonLd?: Record<string, any>[];
}

export function generateMetadata(props: SEOProps): {
  title: string;
  description: string;
  keywords: string;
  openGraph: Record<string, any>;
  twitter: Record<string, any>;
  alternates: Record<string, any>;
  robots: Record<string, any>;
  other: Record<string, any>;
} {
  const {
    title,
    description,
    keywords = [],
    image,
    url,
    type = 'website',
    locale = 'en_US',
    siteName = 'Dropship Ecommerce',
    noindex = false,
    canonical,
    jsonLd = []
  } = props;

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://localhost:3000';
  const fullUrl = url ? `${baseUrl}${url}` : baseUrl;
  const defaultTitle = 'Dropship Ecommerce - Premium Shopping Experience';
  const defaultDescription = 'Discover amazing products at unbeatable prices. Shop our curated collection of high-quality items with fast shipping and excellent customer service.';
  const defaultImage = `${baseUrl}/images/og-default.jpg`;

  return {
    title: title ? `${title} | ${siteName}` : defaultTitle,
    description: description || defaultDescription,
    keywords: keywords.join(', '),
    openGraph: {
      title: title || defaultTitle,
      description: description || defaultDescription,
      url: fullUrl,
      siteName,
      images: [
        {
          url: image || defaultImage,
          width: 1200,
          height: 630,
          alt: title || siteName
        }
      ],
      locale,
      type,
      ...(type === 'product' && {
        product: {
          price: '0.00',
          currency: 'USD',
          availability: 'in stock'
        }
      })
    },
    twitter: {
      card: 'summary_large_image',
      title: title || defaultTitle,
      description: description || defaultDescription,
      images: [image || defaultImage],
      creator: '@dropshipecommerce',
      site: '@dropshipecommerce'
    },
    alternates: {
      canonical: canonical || fullUrl
    },
    robots: {
      index: !noindex,
      follow: !noindex,
      googleBot: {
        index: !noindex,
        follow: !noindex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1
      }
    },
    other: {
      'theme-color': '#000000',
      'msapplication-TileColor': '#000000',
      ...(jsonLd.length > 0 && {
        'application/ld+json': JSON.stringify(jsonLd)
      })
    }
  };
}

// Generate JSON-LD structured data
export function generateProductJsonLd(product: any, url: string) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://localhost:3000';
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images?.map((img: any) => img.url) || [],
    brand: {
      '@type': 'Brand',
      name: 'Dropship Ecommerce'
    },
    offers: {
      '@type': 'Offer',
      url: `${baseUrl}${url}`,
      priceCurrency: 'USD',
      price: product.pricing?.price || 0,
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      itemCondition: 'https://schema.org/NewCondition',
      availability: product.inventory?.quantity > 0 
        ? 'https://schema.org/InStock' 
        : 'https://schema.org/OutOfStock'
    },
    aggregateRating: product.reviews?.length > 0 ? {
      '@type': 'AggregateRating',
      ratingValue: product.averageRating || 0,
      reviewCount: product.reviews.length,
      bestRating: 5,
      worstRating: 1
    } : undefined,
    review: product.reviews?.map((review: any) => ({
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: review.user?.firstName || 'Anonymous'
      },
      reviewRating: {
        '@type': 'Rating',
        ratingValue: review.rating,
        bestRating: 5,
        worstRating: 1
      },
      reviewBody: review.comment,
      datePublished: review.createdAt
    })) || []
  };
}

export function generateBreadcrumbJsonLd(breadcrumbs: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((breadcrumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: breadcrumb.name,
      item: breadcrumb.url
    }))
  };
}

export function generateOrganizationJsonLd() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://localhost:3000';
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Dropship Ecommerce',
    url: baseUrl,
    logo: `${baseUrl}/images/logo.png`,
    description: 'Premium dropshipping ecommerce platform offering quality products at competitive prices.',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-555-0123',
      contactType: 'Customer Service',
      availableLanguage: ['English']
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: '123 Commerce Street',
      addressLocality: 'New York',
      addressRegion: 'NY',
      postalCode: '10001',
      addressCountry: 'US'
    },
    sameAs: [
      'https://facebook.com/dropshipecommerce',
      'https://twitter.com/dropshipecommerce',
      'https://instagram.com/dropshipecommerce'
    ]
  };
}

export function generateWebsiteJsonLd() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://localhost:3000';
  
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Dropship Ecommerce',
    url: baseUrl,
    description: 'Premium dropshipping ecommerce platform offering quality products at competitive prices.',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${baseUrl}/shop/products?q={search_term_string}`,
      'query-input': 'required name=search_term_string'
    }
  };
}

// Generate sitemap
export function generateSitemap(pages: Array<{ url: string; lastModified?: string; changeFreq?: string; priority?: number }>) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://localhost:3000';
  
  return pages.map(page => ({
    url: `${baseUrl}${page.url}`,
    lastModified: page.lastModified || new Date().toISOString(),
    changeFreq: page.changeFreq || 'weekly',
    priority: page.priority || 0.8
  }));
}

// Generate robots.txt
export function generateRobotsTxt() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://localhost:3000';
  
  return `User-agent: *
Allow: /

Sitemap: ${baseUrl}/sitemap.xml

# Block common bot paths
Disallow: /api/
Disallow: /admin/
Disallow: /_next/
Disallow: /static/
Disallow: /*.json$
Disallow: /*.js$

# Allow specific API endpoints for SEO
Allow: /api/products
Allow: /api/categories

# Crawl delay for politeness
Crawl-delay: 1`;
}

// Generate canonical URL
export function generateCanonicalUrl(path: string) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://localhost:3000';
  return `${baseUrl}${path}`;
}

// Generate meta robots
export function generateMetaRobots(noindex: boolean = false, nofollow: boolean = false) {
  const directives = [];
  
  if (noindex) directives.push('noindex');
  if (nofollow) directives.push('nofollow');
  if (!noindex && !nofollow) directives.push('index', 'follow');
  
  return directives.join(', ');
}

// Generate structured data for search results
export function generateSearchResultsJsonLd(searchQuery: string, results: any[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SearchResultsPage',
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: results.length,
      itemListElement: results.map((result, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Product',
          name: result.name,
          description: result.description,
          image: result.images?.[0]?.url,
          url: `${process.env.NEXT_PUBLIC_SITE_URL}/shop/products/${result.slug}`,
          offers: {
            '@type': 'Offer',
            price: result.pricing?.price,
            priceCurrency: 'USD'
          }
        }
      }))
    }
  };
}

// Generate FAQ structured data
export function generateFAQJsonLd(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };
}

// Generate local business structured data
export function generateLocalBusinessJsonLd() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://localhost:3000';
  
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Dropship Ecommerce',
    image: `${baseUrl}/images/storefront.jpg`,
    url: baseUrl,
    telephone: '+1-555-0123',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '123 Commerce Street',
      addressLocality: 'New York',
      addressRegion: 'NY',
      postalCode: '10001',
      addressCountry: 'US'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '40.7128',
      longitude: '-74.0060'
    },
    openingHours: 'Mo-Su 00:00-23:59',
    priceRange: '$$',
    paymentAccepted: ['Credit Card', 'PayPal', 'Apple Pay', 'Google Pay'],
    currenciesAccepted: 'USD'
  };
}

// Generate article structured data
export function generateArticleJsonLd(article: any, url: string) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://localhost:3000';
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    image: article.image || `${baseUrl}/images/article-default.jpg`,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    author: {
      '@type': 'Person',
      name: article.author?.name || 'Dropship Team'
    },
    publisher: {
      '@type': 'Organization',
      name: 'Dropship Ecommerce',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/images/logo.png`
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${baseUrl}${url}`
    }
  };
}

// SEO validation utilities
export function validateSEOProps(props: SEOProps): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (props.title && props.title.length > 60) {
    errors.push('Title should be 60 characters or less for optimal SEO');
  }
  
  if (props.description && props.description.length > 160) {
    errors.push('Description should be 160 characters or less for optimal SEO');
  }
  
  if (props.keywords && props.keywords.length > 10) {
    errors.push('Keywords should be limited to 10 terms for optimal SEO');
  }
  
  if (props.image && !props.image.startsWith('http')) {
    errors.push('Image URL should be absolute for optimal SEO');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

// Performance optimization utilities
export function generatePreloadLinks(resources: Array<{ href: string; as: string; type?: string }>) {
  return resources.map(resource => ({
    rel: 'preload',
    href: resource.href,
    as: resource.as,
    ...(resource.type && { type: resource.type })
  }));
}

export function generatePrefetchLinks(resources: string[]) {
  return resources.map(resource => ({
    rel: 'prefetch',
    href: resource
  }));
}

export function generatePreconnectLinks(origins: string[]) {
  return origins.map(origin => ({
    rel: 'preconnect',
    href: origin
  }));
}

// Generate critical CSS inline styles
export function generateCriticalCSS() {
  return `
    /* Critical CSS for above-the-fold content */
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 0;
    }
    
    .container-custom {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
    }
    
    .btn-primary {
      background-color: #000;
      color: #fff;
      padding: 12px 24px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      text-decoration: none;
      display: inline-block;
    }
    
    .btn-primary:hover {
      background-color: #333;
    }
    
    /* Loading states */
    .loading {
      opacity: 0.6;
      pointer-events: none;
    }
    
    /* Responsive utilities */
    @media (max-width: 768px) {
      .container-custom {
        padding: 0 16px;
      }
    }
  `;
}
