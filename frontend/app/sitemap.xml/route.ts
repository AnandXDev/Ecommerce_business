import { NextResponse } from 'next/server';
import { Product, Category } from '@/models';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://localhost:3000';
  
  try {
    // Fetch data from your database or API
    const [products, categories] = await Promise.all([
      // Replace with your actual data fetching logic
      fetchProducts(),
      fetchCategories()
    ]);

    const staticPages = [
      {
        url: '',
        lastModified: new Date().toISOString(),
        changeFreq: 'weekly',
        priority: 1.0
      },
      {
        url: '/shop',
        lastModified: new Date().toISOString(),
        changeFreq: 'daily',
        priority: 0.9
      },
      {
        url: '/shop/products',
        lastModified: new Date().toISOString(),
        changeFreq: 'daily',
        priority: 0.8
      },
      {
        url: '/about',
        lastModified: new Date().toISOString(),
        changeFreq: 'monthly',
        priority: 0.7
      },
      {
        url: '/contact',
        lastModified: new Date().toISOString(),
        changeFreq: 'monthly',
        priority: 0.6
      },
      {
        url: '/faq',
        lastModified: new Date().toISOString(),
        changeFreq: 'weekly',
        priority: 0.5
      },
      {
        url: '/blog',
        lastModified: new Date().toISOString(),
        changeFreq: 'daily',
        priority: 0.8
      },
      {
        url: '/login',
        lastModified: new Date().toISOString(),
        changeFreq: 'monthly',
        priority: 0.3
      },
      {
        url: '/register',
        lastModified: new Date().toISOString(),
        changeFreq: 'monthly',
        priority: 0.3
      },
      {
        url: '/shop/cart',
        lastModified: new Date().toISOString(),
        changeFreq: 'weekly',
        priority: 0.4
      },
      {
        url: '/shop/checkout',
        lastModified: new Date().toISOString(),
        changeFreq: 'weekly',
        priority: 0.4
      }
    ];

    const productPages = products.map((product: any) => ({
      url: `/shop/products/${product.slug}`,
      lastModified: product.updatedAt || new Date().toISOString(),
      changeFreq: 'weekly',
      priority: 0.8
    }));

    const categoryPages = categories.map((category: any) => ({
      url: `/shop/categories/${category.slug}`,
      lastModified: category.updatedAt || new Date().toISOString(),
      changeFreq: 'weekly',
      priority: 0.7
    }));

    const allPages = [...staticPages, ...productPages, ...categoryPages];

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${allPages.map(page => `
  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${page.lastModified}</lastmod>
    <changefreq>${page.changeFreq}</changefreq>
    <priority>${page.priority}</priority>
    ${page.url.startsWith('/shop/products/') ? generateImageSitemap(page.url) : ''}
  </url>`).join('')}
</urlset>`;

    return new NextResponse(sitemap, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600'
      }
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    
    // Return a basic sitemap on error
    const basicSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`;

    return new NextResponse(basicSitemap, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=300'
      }
    });
  }
}

// Helper functions
async function fetchProducts() {
  // Replace with your actual data fetching logic
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products?limit=1000`);
    const data = await response.json();
    return data.products || [];
  } catch (error) {
    console.error('Error fetching products for sitemap:', error);
    return [];
  }
}

async function fetchCategories() {
  // Replace with your actual data fetching logic
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`);
    const data = await response.json();
    return data.categories || [];
  } catch (error) {
    console.error('Error fetching categories for sitemap:', error);
    return [];
  }
}

function generateImageSitemap(productUrl: string) {
  // This would generate image sitemap data for products
  // For now, return empty string
  return '';
}
