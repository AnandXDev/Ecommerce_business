// Performance optimization utilities

export interface PerformanceMetrics {
  fcp: number; // First Contentful Paint
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  ttfb: number; // Time to First Byte
  domContentLoaded: number;
  loadComplete: number;
}

export interface ImageOptimizationOptions {
  quality?: number;
  format?: 'webp' | 'avif' | 'jpeg' | 'png';
  width?: number;
  height?: number;
  crop?: boolean;
  fit?: 'cover' | 'contain' | 'fill';
}

// Performance monitoring
export class PerformanceMonitorClass {
  private static instance: PerformanceMonitorClass;
  private metrics: Partial<PerformanceMetrics> = {};
  private observers: PerformanceObserver[] = [];

  static getInstance(): PerformanceMonitorClass {
    if (!PerformanceMonitorClass.instance) {
      PerformanceMonitorClass.instance = new PerformanceMonitorClass();
    }
    return PerformanceMonitorClass.instance;
  }

  startMonitoring() {
    if (typeof window === 'undefined') return;

    // Monitor Core Web Vitals
    this.observeFirstContentfulPaint();
    this.observeLargestContentfulPaint();
    this.observeFirstInputDelay();
    this.observeCumulativeLayoutShift();
    this.observeTimeToFirstByte();
    this.observeLoadTiming();
  }

  private observeFirstContentfulPaint() {
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            this.metrics.fcp = entry.startTime;
            this.reportMetric('FCP', entry.startTime);
          }
        }
      });
      observer.observe({ type: 'paint', buffered: true });
      this.observers.push(observer);
    } catch (error) {
      console.warn('FCP monitoring not supported');
    }
  }

  private observeLargestContentfulPaint() {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.metrics.lcp = lastEntry.startTime;
        this.reportMetric('LCP', lastEntry.startTime);
      });
      observer.observe({ type: 'largest-contentful-paint', buffered: true });
      this.observers.push(observer);
    } catch (error) {
      console.warn('LCP monitoring not supported');
    }
  }

  private observeFirstInputDelay() {
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.metrics.fid = (entry as any).processingStart - entry.startTime;
          this.reportMetric('FID', this.metrics.fid);
        }
      });
      observer.observe({ type: 'first-input', buffered: true });
      this.observers.push(observer);
    } catch (error) {
      console.warn('FID monitoring not supported');
    }
  }

  private observeCumulativeLayoutShift() {
    try {
      let clsValue = 0;
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
          }
        }
        this.metrics.cls = clsValue;
        this.reportMetric('CLS', clsValue);
      });
      observer.observe({ type: 'layout-shift', buffered: true });
      this.observers.push(observer);
    } catch (error) {
      console.warn('CLS monitoring not supported');
    }
  }

  private observeTimeToFirstByte() {
    if (performance.timing) {
      const ttfb = performance.timing.responseStart - performance.timing.requestStart;
      this.metrics.ttfb = ttfb;
      this.reportMetric('TTFB', ttfb);
    }
  }

  private observeLoadTiming() {
    if (performance.timing) {
      const domContentLoaded = performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart;
      const loadComplete = performance.timing.loadEventEnd - performance.timing.navigationStart;
      
      this.metrics.domContentLoaded = domContentLoaded;
      this.metrics.loadComplete = loadComplete;
      
      this.reportMetric('DOM Content Loaded', domContentLoaded);
      this.reportMetric('Load Complete', loadComplete);
    }
  }

  private reportMetric(name: string, value: number) {
    // Send to analytics service
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'web_vitals', {
        name,
        value: Math.round(value),
        event_category: 'Web Vitals'
      });
    }

    // Console logging for development
    if (process.env.NODE_ENV === 'development') {
      console.log(`🚀 ${name}: ${value.toFixed(2)}ms`);
    }
  }

  getMetrics(): PerformanceMetrics {
    return this.metrics as PerformanceMetrics;
  }

  stopMonitoring() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

// Image optimization utilities
export function optimizeImageUrl(
  url: string,
  options: ImageOptimizationOptions = {}
): string {
  const {
    quality = 80,
    format = 'webp',
    width,
    height,
    crop = false,
    fit = 'cover'
  } = options;

  if (!url) return url;

  try {
    const urlObj = new URL(url);
    const params = new URLSearchParams(urlObj.search);

    // Add optimization parameters
    params.set('q', quality.toString());
    params.set('f', format);

    if (width) params.set('w', width.toString());
    if (height) params.set('h', height.toString());
    if (crop) params.set('crop', '1');
    if (fit !== 'cover') params.set('fit', fit);

    urlObj.search = params.toString();
    return urlObj.toString();
  } catch (error) {
    // If URL parsing fails, return original URL
    return url;
  }
}

// Lazy loading for images
export function createLazyImageObserver(): IntersectionObserver {
  if (typeof IntersectionObserver === 'undefined') {
    // Fallback for older browsers
    return {
      observe: () => {},
      unobserve: () => {},
      disconnect: () => {}
    } as unknown as IntersectionObserver;
  }

  return new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement;
        const src = img.dataset.src;
        const srcset = img.dataset.srcset;

        if (src) {
          img.src = src;
          img.classList.remove('lazy');
          img.classList.add('loaded');
        }

        if (srcset) {
          img.srcset = srcset;
        }

        // Remove data attributes after loading
        delete img.dataset.src;
        delete img.dataset.srcset;

        // Stop observing this image
        imageObserver.unobserve(img);
      }
    });
  }, {
    rootMargin: '50px 0px', // Start loading 50px before image comes into view
    threshold: 0.1
  });
}

export const imageObserver = createLazyImageObserver();

// Resource loading optimization
export function preloadResource(href: string, as: string, type?: string): void {
  if (typeof document === 'undefined') return;

  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = href;
  link.as = as;
  
  if (type) {
    link.type = type;
  }

  document.head.appendChild(link);
}

export function prefetchResource(href: string): void {
  if (typeof document === 'undefined') return;

  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = href;

  document.head.appendChild(link);
}

export function preconnectToOrigin(origin: string): void {
  if (typeof document === 'undefined') return;

  const link = document.createElement('link');
  link.rel = 'preconnect';
  link.href = origin;

  document.head.appendChild(link);
}

// Critical resource preloading
export function preloadCriticalResources(): void {
  const criticalResources = [
    { href: '/fonts/inter-var.woff2', as: 'font', type: 'font/woff2' },
    { href: '/images/logo.svg', as: 'image' },
    { href: '/css/critical.css', as: 'style' }
  ];

  criticalResources.forEach(resource => {
    preloadResource(resource.href, resource.as, resource.type);
  });
}

// DNS prefetching
export function dnsPrefetchOrigins(): void {
  const origins = [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
    'https://www.google-analytics.com',
    'https://api.stripe.com'
  ];

  origins.forEach(origin => {
    if (typeof document !== 'undefined') {
      const link = document.createElement('link');
      link.rel = 'dns-prefetch';
      link.href = origin;
      document.head.appendChild(link);
    }
  });
}

// Service Worker registration
export function registerServiceWorker(): void {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;

  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

// Cache management
export class CacheManager {
  private static cacheName = 'dropship-ecommerce-v1';

  static async cacheResources(urls: string[]): Promise<void> {
    if (!('caches' in window)) return;

    try {
      const cache = await caches.open(this.cacheName);
      await cache.addAll(urls);
      console.log('Resources cached successfully');
    } catch (error) {
      console.error('Failed to cache resources:', error);
    }
  }

  static async getCachedResource(url: string): Promise<Response | undefined> {
    if (!('caches' in window)) return undefined;

    try {
      const cache = await caches.open(this.cacheName);
      return await cache.match(url);
    } catch (error) {
      console.error('Failed to get cached resource:', error);
      return undefined;
    }
  }

  static async clearCache(): Promise<void> {
    if (!('caches' in window)) return;

    try {
      await caches.delete(this.cacheName);
      console.log('Cache cleared successfully');
    } catch (error) {
      console.error('Failed to clear cache:', error);
    }
  }
}

// Bundle size optimization
export function loadScriptAsync(src: string, async: boolean = true): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof document === 'undefined') {
      reject(new Error('Document not available'));
      return;
    }

    const script = document.createElement('script');
    script.src = src;
    script.async = async;
    
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));

    document.head.appendChild(script);
  });
}

export function loadStylesheet(href: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof document === 'undefined') {
      reject(new Error('Document not available'));
      return;
    }

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    
    link.onload = () => resolve();
    link.onerror = () => reject(new Error(`Failed to load stylesheet: ${href}`));

    document.head.appendChild(link);
  });
}

// Performance utilities
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Memory management
export function cleanup(): void {
  // Stop performance monitoring
  const monitor = PerformanceMonitorClass.getInstance();
  monitor.stopMonitoring();
  
  // Disconnect image observer
  imageObserver.disconnect();
  
  // Clear event listeners
  if (typeof window !== 'undefined') {
    window.removeEventListener('load', preloadCriticalResources);
  }
}

// Initialize performance optimizations
export function initializePerformanceOptimizations(): void {
  if (typeof window === 'undefined') return;

  // Start performance monitoring
  const monitor = PerformanceMonitorClass.getInstance();
  monitor.startMonitoring();

  // Preload critical resources
  preloadCriticalResources();
  
  // DNS prefetching
  dnsPrefetchOrigins();
  
  // Register service worker
  registerServiceWorker();
  
  // Setup lazy loading for images
  document.addEventListener('DOMContentLoaded', () => {
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => imageObserver.observe(img));
  });

  // Cleanup on page unload
  window.addEventListener('beforeunload', cleanup);
}

// Export for use in components
export {
  PerformanceMonitorClass as PerformanceMonitor
};
