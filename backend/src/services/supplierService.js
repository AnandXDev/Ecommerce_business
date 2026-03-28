const Supplier = require('../models/Supplier');
const Product = require('../models/Product');
const Order = require('../models/Order');
const axios = require('axios');
const crypto = require('crypto');

class SupplierService {
  constructor() {
    this.supplierIntegrations = new Map();
    this.initializeIntegrations();
  }

  // Initialize supplier integrations
  initializeIntegrations() {
    // AliExpress Integration
    this.supplierIntegrations.set('aliexpress', {
      name: 'AliExpress',
      baseUrl: 'https://api.aliexpress.com/rest',
      apiKey: process.env.ALIEXPRESS_API_KEY,
      apiSecret: process.env.ALIEXPRESS_API_SECRET,
      orderEndpoint: '/order/order',
      productEndpoint: '/product/query',
      trackingEndpoint: '/logistics/query'
    });

    // Shopify Dropshipping Integration
    this.supplierIntegrations.set('shopify', {
      name: 'Shopify Dropshipping',
      baseUrl: 'https://{shop}.myshopify.com/admin/api/2023-01',
      accessToken: process.env.SHOPIFY_ACCESS_TOKEN,
      orderEndpoint: '/orders.json',
      productEndpoint: '/products.json',
      fulfillmentEndpoint: '/fulfillments.json'
    });

    // Custom Supplier API Integration
    this.supplierIntegrations.set('custom', {
      name: 'Custom Supplier',
      baseUrl: process.env.CUSTOM_SUPPLIER_API_URL,
      apiKey: process.env.CUSTOM_SUPPLIER_API_KEY,
      orderEndpoint: '/orders',
      productEndpoint: '/products',
      inventoryEndpoint: '/inventory'
    });
  }

  // Get supplier by ID
  async getSupplierById(supplierId) {
    try {
      const supplier = await Supplier.findById(supplierId);
      if (!supplier) {
        throw new Error('Supplier not found');
      }
      return supplier;
    } catch (error) {
      throw new Error(`Failed to get supplier: ${error.message}`);
    }
  }

  // Get all active suppliers
  async getActiveSuppliers() {
    try {
      const suppliers = await Supplier.find({ isActive: true })
        .sort({ name: 1 });
      return suppliers;
    } catch (error) {
      throw new Error(`Failed to get suppliers: ${error.message}`);
    }
  }

  // Sync products from supplier
  async syncProductsFromSupplier(supplierId) {
    try {
      const supplier = await this.getSupplierById(supplierId);
      const integration = this.supplierIntegrations.get(supplier.integrationType);

      if (!integration) {
        throw new Error(`Unsupported integration type: ${supplier.integrationType}`);
      }

      let products = [];

      // Fetch products based on integration type
      switch (supplier.integrationType) {
        case 'aliexpress':
          products = await this.fetchAliExpressProducts(supplier, integration);
          break;
        case 'shopify':
          products = await this.fetchShopifyProducts(supplier, integration);
          break;
        case 'custom':
          products = await this.fetchCustomProducts(supplier, integration);
          break;
        default:
          throw new Error(`Unsupported integration type: ${supplier.integrationType}`);
      }

      // Update or create products in database
      const updatedProducts = await this.updateProductsFromSupplier(products, supplierId);

      // Update supplier last sync time
      await Supplier.findByIdAndUpdate(supplierId, {
        lastSyncAt: new Date(),
        productCount: updatedProducts.length
      });

      return updatedProducts;
    } catch (error) {
      throw new Error(`Failed to sync products: ${error.message}`);
    }
  }

  // Fetch products from AliExpress
  async fetchAliExpressProducts(supplier, integration) {
    try {
      const response = await axios.get(`${integration.baseUrl}${integration.productEndpoint}`, {
        params: {
          app_key: integration.apiKey,
          timestamp: Date.now(),
          method: 'aliexpress.product.query',
          sign: this.generateAliExpressSign(integration),
          fields: 'product_id,subject,product_url,product_main_image_url,original_price,sale_price,evaluated_score,commission_rate,30days_commision'
        }
      });

      return response.data.products || [];
    } catch (error) {
      console.error('AliExpress API error:', error);
      throw new Error('Failed to fetch products from AliExpress');
    }
  }

  // Fetch products from Shopify
  async fetchShopifyProducts(supplier, integration) {
    try {
      const url = integration.baseUrl.replace('{shop}', supplier.shopDomain) + integration.productEndpoint;
      
      const response = await axios.get(url, {
        headers: {
          'X-Shopify-Access-Token': integration.accessToken,
          'Content-Type': 'application/json'
        }
      });

      return response.data.products || [];
    } catch (error) {
      console.error('Shopify API error:', error);
      throw new Error('Failed to fetch products from Shopify');
    }
  }

  // Fetch products from custom supplier
  async fetchCustomProducts(supplier, integration) {
    try {
      const response = await axios.get(`${integration.baseUrl}${integration.productEndpoint}`, {
        headers: {
          'Authorization': `Bearer ${integration.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      return response.data.products || [];
    } catch (error) {
      console.error('Custom supplier API error:', error);
      throw new Error('Failed to fetch products from custom supplier');
    }
  }

  // Update products from supplier data
  async updateProductsFromSupplier(products, supplierId) {
    const updatedProducts = [];

    for (const productData of products) {
      try {
        // Check if product already exists
        const existingProduct = await Product.findOne({
          supplierId,
          supplierProductId: productData.id || productData.product_id
        });

        let product;
        if (existingProduct) {
          // Update existing product
          product = await Product.findByIdAndUpdate(
            existingProduct._id,
            {
              name: productData.subject || productData.title,
              description: productData.description || '',
              images: this.processImages(productData),
              pricing: {
                cost: parseFloat(productData.original_price || productData.cost || 0),
                price: this.calculateRetailPrice(productData),
                comparePrice: parseFloat(productData.original_price || productData.compare_price || 0)
              },
              inventory: {
                quantity: parseInt(productData.quantity || 999),
                sku: productData.sku || `${supplierId}-${productData.id}`,
                lowStockThreshold: 10
              },
              shipping: {
                weight: parseFloat(productData.weight || 0),
                dimensions: {
                  length: parseFloat(productData.length || 10),
                  width: parseFloat(productData.width || 10),
                  height: parseFloat(productData.height || 10)
                },
                freeShipping: parseFloat(productData.original_price || 0) > 50
              },
              supplierProductId: productData.id || productData.product_id,
              supplierUrl: productData.product_url || productData.url,
              isActive: true,
              lastSyncAt: new Date()
            },
            { new: true }
          );
        } else {
          // Create new product
          product = await Product.create({
            name: productData.subject || productData.title,
            description: productData.description || '',
            images: this.processImages(productData),
            pricing: {
              cost: parseFloat(productData.original_price || productData.cost || 0),
              price: this.calculateRetailPrice(productData),
              comparePrice: parseFloat(productData.original_price || productData.compare_price || 0)
            },
            inventory: {
              quantity: parseInt(productData.quantity || 999),
              sku: productData.sku || `${supplierId}-${productData.id}`,
              lowStockThreshold: 10
            },
            shipping: {
              weight: parseFloat(productData.weight || 0),
              dimensions: {
                length: parseFloat(productData.length || 10),
                width: parseFloat(productData.width || 10),
                height: parseFloat(productData.height || 10)
              },
              freeShipping: parseFloat(productData.original_price || 0) > 50
            },
            category: await this.getDefaultCategory(),
            supplier: supplierId,
            supplierProductId: productData.id || productData.product_id,
            supplierUrl: productData.product_url || productData.url,
            isActive: true,
            lastSyncAt: new Date()
          });
        }

        updatedProducts.push(product);
      } catch (error) {
        console.error(`Error processing product ${productData.id}:`, error);
      }
    }

    return updatedProducts;
  }

  // Process images from supplier data
  processImages(productData) {
    const images = [];
    
    if (productData.product_main_image_url) {
      images.push({
        url: productData.product_main_image_url,
        alt: productData.subject || 'Product image'
      });
    }

    if (productData.images && Array.isArray(productData.images)) {
      productData.images.forEach(image => {
        images.push({
          url: image.url || image.src,
          alt: image.alt || 'Product image'
        });
      });
    }

    return images.length > 0 ? images : [{
      url: '/api/placeholder/300/300',
      alt: 'Product placeholder'
    }];
  }

  // Calculate retail price with markup
  calculateRetailPrice(productData) {
    const cost = parseFloat(productData.original_price || productData.cost || 0);
    const markupPercentage = 0.3; // 30% markup
    return cost * (1 + markupPercentage);
  }

  // Get default category
  async getDefaultCategory() {
    try {
      const Category = require('../models/Category');
      let category = await Category.findOne({ name: 'General' });
      
      if (!category) {
        category = await Category.create({
          name: 'General',
          slug: 'general',
          description: 'General products category'
        });
      }
      
      return category._id;
    } catch (error) {
      return null;
    }
  }

  // Place order with supplier
  async placeOrderWithSupplier(supplierId, orderData) {
    try {
      const supplier = await this.getSupplierById(supplierId);
      const integration = this.supplierIntegrations.get(supplier.integrationType);

      if (!integration) {
        throw new Error(`Unsupported integration type: ${supplier.integrationType}`);
      }

      let supplierOrder;

      // Place order based on integration type
      switch (supplier.integrationType) {
        case 'aliexpress':
          supplierOrder = await this.placeAliExpressOrder(supplier, integration, orderData);
          break;
        case 'shopify':
          supplierOrder = await this.placeShopifyOrder(supplier, integration, orderData);
          break;
        case 'custom':
          supplierOrder = await this.placeCustomOrder(supplier, integration, orderData);
          break;
        default:
          throw new Error(`Unsupported integration type: ${supplier.integrationType}`);
      }

      return supplierOrder;
    } catch (error) {
      throw new Error(`Failed to place order with supplier: ${error.message}`);
    }
  }

  // Place order with AliExpress
  async placeAliExpressOrder(supplier, integration, orderData) {
    try {
      const response = await axios.post(`${integration.baseUrl}${integration.orderEndpoint}`, {
        app_key: integration.apiKey,
        timestamp: Date.now(),
        method: 'aliexpress.order.place',
        sign: this.generateAliExpressSign(integration),
        param: JSON.stringify({
          product_id: orderData.supplierProductId,
          quantity: orderData.quantity,
          shipping_address: orderData.shippingAddress,
          currency: 'USD'
        })
      });

      return response.data;
    } catch (error) {
      console.error('AliExpress order error:', error);
      throw new Error('Failed to place order with AliExpress');
    }
  }

  // Place order with Shopify
  async placeShopifyOrder(supplier, integration, orderData) {
    try {
      const url = integration.baseUrl.replace('{shop}', supplier.shopDomain) + integration.orderEndpoint;
      
      const response = await axios.post(url, {
        order: {
          line_items: [{
            product_id: orderData.supplierProductId,
            quantity: orderData.quantity
          }],
          shipping_address: orderData.shippingAddress,
          currency: 'USD'
        }
      }, {
        headers: {
          'X-Shopify-Access-Token': integration.accessToken,
          'Content-Type': 'application/json'
        }
      });

      return response.data.order;
    } catch (error) {
      console.error('Shopify order error:', error);
      throw new Error('Failed to place order with Shopify');
    }
  }

  // Place order with custom supplier
  async placeCustomOrder(supplier, integration, orderData) {
    try {
      const response = await axios.post(`${integration.baseUrl}${integration.orderEndpoint}`, {
        product_id: orderData.supplierProductId,
        quantity: orderData.quantity,
        shipping_address: orderData.shippingAddress,
        customer_info: orderData.customerInfo
      }, {
        headers: {
          'Authorization': `Bearer ${integration.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      return response.data;
    } catch (error) {
      console.error('Custom supplier order error:', error);
      throw new Error('Failed to place order with custom supplier');
    }
  }

  // Get order tracking from supplier
  async getOrderTracking(supplierId, supplierOrderId) {
    try {
      const supplier = await this.getSupplierById(supplierId);
      const integration = this.supplierIntegrations.get(supplier.integrationType);

      if (!integration) {
        throw new Error(`Unsupported integration type: ${supplier.integrationType}`);
      }

      let trackingInfo;

      // Get tracking based on integration type
      switch (supplier.integrationType) {
        case 'aliexpress':
          trackingInfo = await this.getAliExpressTracking(supplier, integration, supplierOrderId);
          break;
        case 'shopify':
          trackingInfo = await this.getShopifyTracking(supplier, integration, supplierOrderId);
          break;
        case 'custom':
          trackingInfo = await this.getCustomTracking(supplier, integration, supplierOrderId);
          break;
        default:
          throw new Error(`Unsupported integration type: ${supplier.integrationType}`);
      }

      return trackingInfo;
    } catch (error) {
      throw new Error(`Failed to get order tracking: ${error.message}`);
    }
  }

  // Get AliExpress tracking
  async getAliExpressTracking(supplier, integration, supplierOrderId) {
    try {
      const response = await axios.get(`${integration.baseUrl}${integration.trackingEndpoint}`, {
        params: {
          app_key: integration.apiKey,
          timestamp: Date.now(),
          method: 'aliexpress.logistics.query',
          sign: this.generateAliExpressSign(integration),
          order_id: supplierOrderId
        }
      });

      return response.data;
    } catch (error) {
      console.error('AliExpress tracking error:', error);
      throw new Error('Failed to get tracking from AliExpress');
    }
  }

  // Get Shopify tracking
  async getShopifyTracking(supplier, integration, supplierOrderId) {
    try {
      const url = integration.baseUrl.replace('{shop}', supplier.shopDomain) + '/orders/' + supplierOrderId + '/fulfillments.json';
      
      const response = await axios.get(url, {
        headers: {
          'X-Shopify-Access-Token': integration.accessToken,
          'Content-Type': 'application/json'
        }
      });

      return response.data.fulfillments || [];
    } catch (error) {
      console.error('Shopify tracking error:', error);
      throw new Error('Failed to get tracking from Shopify');
    }
  }

  // Get custom supplier tracking
  async getCustomTracking(supplier, integration, supplierOrderId) {
    try {
      const response = await axios.get(`${integration.baseUrl}/orders/${supplierOrderId}/tracking`, {
        headers: {
          'Authorization': `Bearer ${integration.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      return response.data;
    } catch (error) {
      console.error('Custom supplier tracking error:', error);
      throw new Error('Failed to get tracking from custom supplier');
    }
  }

  // Generate AliExpress signature
  generateAliExpressSign(integration) {
    const timestamp = Date.now();
    const params = `app_key=${integration.apiKey}&timestamp=${timestamp}`;
    const sign = crypto
      .createHmac('sha256', integration.apiSecret)
      .update(params)
      .digest('hex')
      .toUpperCase();
    
    return sign;
  }

  // Update inventory from supplier
  async updateInventoryFromSupplier(supplierId) {
    try {
      const supplier = await this.getSupplierById(supplierId);
      const integration = this.supplierIntegrations.get(supplier.integrationType);

      if (!integration || !integration.inventoryEndpoint) {
        return [];
      }

      const response = await axios.get(`${integration.baseUrl}${integration.inventoryEndpoint}`, {
        headers: {
          'Authorization': `Bearer ${integration.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      const inventoryUpdates = response.data.inventory || [];

      // Update product inventory in database
      for (const item of inventoryUpdates) {
        await Product.updateOne(
          { supplierId, supplierProductId: item.product_id },
          { 
            'inventory.quantity': item.quantity,
            'inventory.lastUpdated': new Date()
          }
        );
      }

      return inventoryUpdates;
    } catch (error) {
      throw new Error(`Failed to update inventory: ${error.message}`);
    }
  }
}

module.exports = new SupplierService();
