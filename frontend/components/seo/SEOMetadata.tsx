'use client';

import Head from 'next/head';
import Script from 'next/script';
import { SEOProps } from '@/lib/seo';

interface SEOMetadataProps extends SEOProps {
  structuredData?: Record<string, any>[];
  preloadResources?: Array<{ href: string; as: string; type?: string }>;
  prefetchResources?: string[];
  preconnectOrigins?: string[];
}

export function SEOMetadata({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  locale = 'en_US',
  siteName = 'Dropship Ecommerce',
  noindex = false,
  canonical,
  jsonLd = [],
  structuredData = [],
  preloadResources = [],
  prefetchResources = [],
  preconnectOrigins = []
}: SEOMetadataProps) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://localhost:3000';
  const fullUrl = url ? `${baseUrl}${url}` : baseUrl;
  const defaultTitle = 'Dropship Ecommerce - Premium Shopping Experience';
  const defaultDescription = 'Discover amazing products at unbeatable prices. Shop our curated collection of high-quality items with fast shipping and excellent customer service.';
  const defaultImage = `${baseUrl}/images/og-default.jpg`;

  const allStructuredData = [...jsonLd, ...structuredData];

  return (
    <>
      <Head>
        {/* Basic Meta Tags */}
        <title>{title ? `${title} | ${siteName}` : defaultTitle}</title>
        <meta name="description" content={description || defaultDescription} />
        {keywords && keywords.length > 0 && (
          <meta name="keywords" content={keywords.join(', ')} />
        )}
        
        {/* Canonical URL */}
        <link
          rel="canonical"
          href={canonical || fullUrl}
        />
        
        {/* Viewport and Theme */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#000000" />
        <meta name="msapplication-TileColor" content="#000000" />
        
        {/* Robots */}
        <meta
          name="robots"
          content={`${noindex ? 'noindex' : 'index'}, ${noindex ? 'nofollow' : 'follow'}`}
        />
        <meta
          name="googlebot"
          content={`${noindex ? 'noindex' : 'index'}, ${noindex ? 'nofollow' : 'follow'}, max-video-preview:-1, max-image-preview:large, max-snippet:-1`}
        />
        
        {/* Open Graph */}
        <meta property="og:title" content={title || defaultTitle} />
        <meta property="og:description" content={description || defaultDescription} />
        <meta property="og:url" content={fullUrl} />
        <meta property="og:site_name" content={siteName} />
        <meta property="og:locale" content={locale} />
        <meta property="og:type" content={type} />
        
        {/* Open Graph Image */}
        <meta property="og:image" content={image || defaultImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={title || siteName} />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title || defaultTitle} />
        <meta name="twitter:description" content={description || defaultDescription} />
        <meta name="twitter:image" content={image || defaultImage} />
        <meta name="twitter:creator" content="@dropshipecommerce" />
        <meta name="twitter:site" content="@dropshipecommerce" />
        
        {/* Additional Meta Tags */}
        <meta name="author" content={siteName} />
        <meta name="publisher" content={siteName} />
        <meta name="generator" content="Next.js" />
        
        {/* Preload Resources */}
        {preloadResources.map((resource, index) => (
          <link
            key={`preload-${index}`}
            rel="preload"
            href={resource.href}
            as={resource.as}
            {...(resource.type && { type: resource.type })}
          />
        ))}
        
        {/* Prefetch Resources */}
        {prefetchResources.map((resource, index) => (
          <link
            key={`prefetch-${index}`}
            rel="prefetch"
            href={resource}
          />
        ))}
        
        {/* Preconnect Origins */}
        {preconnectOrigins.map((origin, index) => (
          <link
            key={`preconnect-${index}`}
            rel="preconnect"
            href={origin}
          />
        ))}
        
        {/* DNS Prefetch */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        <link rel="dns-prefetch" href="//www.google-analytics.com" />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        
        {/* Security Headers */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
        <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />
        
        {/* Performance */}
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content={siteName} />
        
        {/* Structured Data */}
        {allStructuredData.map((data, index) => (
          <script
            key={`structured-data-${index}`}
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(data)
            }}
          />
        ))}
      </Head>
      
      {/* Performance Scripts */}
      <Script
        id="performance-optimization"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            // Performance optimizations
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js').then(function(registration) {
                  console.log('SW registered: ', registration);
                }).catch(function(registrationError) {
                  console.log('SW registration failed: ', registrationError);
                });
              });
            }
            
            // Preload critical resources
            function preloadResource(url, as, type) {
              const link = document.createElement('link');
              link.rel = 'preload';
              link.href = url;
              link.as = as;
              if (type) link.type = type;
              document.head.appendChild(link);
            }
            
            // Lazy loading for images
            if ('IntersectionObserver' in window) {
              const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                  if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                      img.src = img.dataset.src;
                      img.classList.remove('lazy');
                      imageObserver.unobserve(img);
                    }
                  }
                });
              });
              
              document.addEventListener('DOMContentLoaded', () => {
                document.querySelectorAll('img[data-src]').forEach(img => {
                  imageObserver.observe(img);
                });
              });
            }
          `
        }}
      />
      
      {/* Analytics */}
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            // Google Analytics (replace with your tracking ID)
            (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
            (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
            m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
            })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
            
            ga('create', 'GA_MEASUREMENT_ID', 'auto');
            ga('send', 'pageview');
          `
        }}
      />
      
      {/* Rich Snippets Enhancement */}
      <Script
        id="rich-snippets"
        strategy="lazyOnload"
        dangerouslySetInnerHTML={{
          __html: `
            // Add structured data for rich snippets
            function addStructuredData(data) {
              const script = document.createElement('script');
              script.type = 'application/ld+json';
              script.textContent = JSON.stringify(data);
              document.head.appendChild(script);
            }
            
            // Add breadcrumbs if available
            const breadcrumbs = document.querySelector('[data-breadcrumbs]');
            if (breadcrumbs) {
              const breadcrumbData = JSON.parse(breadcrumbs.getAttribute('data-breadcrumbs') || '[]');
              if (breadcrumbData.length > 0) {
                addStructuredData({
                  '@context': 'https://schema.org',
                  '@type': 'BreadcrumbList',
                  itemListElement: breadcrumbData.map((item, index) => ({
                    '@type': 'ListItem',
                    position: index + 1,
                    name: item.name,
                    item: item.url
                  }))
                });
              }
            }
          `
        }}
      />
    </>
  );
}
