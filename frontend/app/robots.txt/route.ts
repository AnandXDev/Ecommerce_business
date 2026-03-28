import { NextResponse } from 'next/server';

export function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://localhost:3000';
  
  const robotsTxt = `# Global directives
User-agent: *
Allow: /

# Sitemap
Sitemap: ${baseUrl}/sitemap.xml

# Block common bot paths
Disallow: /api/
Disallow: /admin/
Disallow: /_next/
Disallow: /static/
Disallow: /*.json$
Disallow: /*.js$
Disallow: /*.css$

# Allow specific API endpoints for SEO
Allow: /api/products
Allow: /api/categories
Allow: /api/search

# Special directives for specific bots
User-agent: Googlebot
Allow: /
Crawl-delay: 1

User-agent: Bingbot
Allow: /
Crawl-delay: 1

User-agent: Slurp
Allow: /
Crawl-delay: 1

# Block unwanted bots
User-agent: AhrefsBot
Disallow: /

User-agent: MJ12bot
Disallow: /

User-agent: DotBot
Disallow: /

User-agent: BLEXBot
Disallow: /

User-agent: BacklinkCrawler
Disallow: /

# Additional rules
User-agent: *
Disallow: /checkout/
Disallow: /cart/
Disallow: /account/
Disallow: /admin/
Disallow: /api/private/
Disallow: /*?sort=*
Disallow: /*?filter=*
Disallow: /*search?*
Disallow: /*page=*
Noindex: /search
Noindex: /checkout/*
Noindex: /cart/*
Noindex: /account/*
Noindex: /admin/*

# Allow image indexing
User-agent: Googlebot-Image
Allow: /images/
Allow: /api/products/*/images

# Allow CSS and JS for rendering
User-agent: Googlebot
Allow: /*.css$
Allow: /*.js$

# Host directive for Yandex
Host: ${baseUrl.replace('https://', '').replace('http://', '')}`;

  return new NextResponse(robotsTxt, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400'
    }
  });
}
