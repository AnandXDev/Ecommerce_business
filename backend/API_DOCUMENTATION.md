# LuxeCart Profile Management API Documentation

## 📋 Table of Contents

1. [Authentication](#authentication)
2. [User Profile](#user-profile)
3. [Account Settings](#account-settings)
4. [Password & Security](#password--security)
5. [Orders Management](#orders-management)
6. [Wishlist System](#wishlist-system)
7. [Saved Carts System](#saved-carts-system)
8. [Account Statistics](#account-statistics)
9. [Address Management](#address-management)
10. [Error Responses](#error-responses)
11. [Rate Limiting](#rate-limiting)

---

## 🔐 Authentication

All protected routes require a valid JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Login Response Example:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "email": "user@example.com",
      "fullName": "John Doe"
    }
  }
}
```

---

## 👤 User Profile

### Get Current User Profile

**Endpoint:** `GET /api/user/profile`

**Headers:** 
- `Authorization: Bearer <token>`

**Success Response (200):**
```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "fullName": "John Doe",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "avatar": "https://example.com/avatar.jpg",
    "address": {
      "street": "123 Commerce Street",
      "city": "Mumbai",
      "state": "Maharashtra",
      "zipCode": "400001",
      "country": "India"
    },
    "settings": {
      "language": "en",
      "timezone": "Asia/Kolkata",
      "currency": "INR",
      "emailNotifications": true,
      "smsNotifications": true,
      "marketingEmails": false
    },
    "isEmailVerified": true,
    "isPhoneVerified": false,
    "lastLogin": "2024-01-15T10:30:00.000Z",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "stats": {
      "totalOrders": 15,
      "wishlistItems": 8,
      "savedCarts": 3
    }
  }
}
```

### Update User Profile

**Endpoint:** `PUT /api/user/profile`

**Headers:** 
- `Authorization: Bearer <token>`
- `Content-Type: application/json`

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Smith",
  "email": "johnsmith@example.com",
  "phone": "9876543210",
  "avatar": "https://example.com/new-avatar.jpg",
  "address": {
    "street": "456 New Street",
    "city": "Bangalore",
    "state": "Karnataka",
    "zipCode": "560001",
    "country": "India"
  }
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "fullName": "John Smith",
    "firstName": "John",
    "lastName": "Smith",
    "email": "johnsmith@example.com",
    "phone": "9876543210",
    "avatar": "https://example.com/new-avatar.jpg",
    "address": {
      "street": "456 New Street",
      "city": "Bangalore",
      "state": "Karnataka",
      "zipCode": "560001",
      "country": "India"
    },
    "isEmailVerified": false
  }
}
```

---

## ⚙️ Account Settings

### Update Settings

**Endpoint:** `PUT /api/user/settings`

**Headers:** 
- `Authorization: Bearer <token>`
- `Content-Type: application/json`

**Request Body:**
```json
{
  "language": "hi",
  "timezone": "Asia/Kolkata",
  "currency": "INR",
  "emailNotifications": true,
  "smsNotifications": false,
  "marketingEmails": false
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Settings updated successfully",
  "data": {
    "language": "hi",
    "timezone": "Asia/Kolkata",
    "currency": "INR",
    "emailNotifications": true,
    "smsNotifications": false,
    "marketingEmails": false
  }
}
```

---

## 🔒 Password & Security

### Change Password

**Endpoint:** `PUT /api/user/password`

**Headers:** 
- `Authorization: Bearer <token>`
- `Content-Type: application/json`

**Request Body:**
```json
{
  "currentPassword": "oldPassword123",
  "newPassword": "newPassword456",
  "confirmPassword": "newPassword456"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

### Upload Avatar

**Endpoint:** `POST /api/user/avatar`

**Headers:** 
- `Authorization: Bearer <token>`
- `Content-Type: application/json`

**Request Body:**
```json
{
  "avatar": "https://example.com/avatar.jpg"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Avatar updated successfully",
  "data": {
    "avatar": "https://example.com/avatar.jpg"
  }
}
```

---

## 📦 Orders Management

### Get All Orders

**Endpoint:** `GET /api/orders`

**Headers:** 
- `Authorization: Bearer <token>`

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `status` (optional): Filter by status (pending, confirmed, processing, shipped, delivered, cancelled)
- `search` (optional): Search by order number or product name
- `sortBy` (optional): Sort field (default: createdAt)
- `sortOrder` (optional): Sort order (asc, desc) (default: desc)

**Example Request:** `GET /api/orders?page=1&limit=10&status=delivered&search=LAPTOP`

**Success Response (200):**
```json
{
  "success": true,
  "message": "Orders retrieved successfully",
  "data": [
    {
      "id": "64f8a1b2c3d4e5f6a7b8c9d1",
      "orderNumber": "ORD-2024-001234",
      "status": "delivered",
      "paymentStatus": "paid",
      "paymentMethod": "razorpay",
      "items": [
        {
          "id": "64f8a1b2c3d4e5f6a7b8c9d2",
          "product": {
            "id": "64f8a1b2c3d4e5f6a7b8c9d3",
            "name": "Premium Laptop",
            "slug": "premium-laptop",
            "images": ["https://example.com/laptop.jpg"]
          },
          "quantity": 1,
          "price": 45000,
          "total": 45000
        }
      ],
      "pricing": {
        "subtotal": 45000,
        "tax": 8100,
        "shipping": 0,
        "total": 53100
      },
      "shippingAddress": {
        "fullName": "John Doe",
        "street": "123 Commerce Street",
        "city": "Mumbai",
        "state": "Maharashtra",
        "zipCode": "400001"
      },
      "trackingNumber": "TRK123456789",
      "estimatedDelivery": "2024-01-20T00:00:00.000Z",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-20T14:20:00.000Z"
    }
  ],
  "meta": {
    "total": 15,
    "page": 1,
    "limit": 10,
    "totalPages": 2,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

### Get Single Order

**Endpoint:** `GET /api/orders/:id`

**Headers:** 
- `Authorization: Bearer <token>`

**Success Response (200):**
```json
{
  "success": true,
  "message": "Order retrieved successfully",
  "data": {
    "id": "64f8a1b2c3d4e5f6a7b8c9d1",
    "orderNumber": "ORD-2024-001234",
    "status": "shipped",
    "paymentStatus": "paid",
    "paymentMethod": "razorpay",
    "items": [...],
    "pricing": {...},
    "shippingAddress": {...},
    "billingAddress": {...},
    "trackingNumber": "TRK123456789",
    "estimatedDelivery": "2024-01-20T00:00:00.000Z",
    "notes": "Handle with care",
    "customer": {
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "9876543210"
    },
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-18T16:45:00.000Z"
  }
}
```

### Cancel Order

**Endpoint:** `PUT /api/orders/:id/cancel`

**Headers:** 
- `Authorization: Bearer <token>`
- `Content-Type: application/json`

**Request Body:**
```json
{
  "reason": "Customer requested cancellation"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Order cancelled successfully",
  "data": {
    "orderId": "64f8a1b2c3d4e5f6a7b8c9d1",
    "orderNumber": "ORD-2024-001234",
    "status": "cancelled",
    "cancelledAt": "2024-01-16T09:15:00.000Z"
  }
}
```

### Track Order

**Endpoint:** `GET /api/orders/:id/track`

**Headers:** 
- `Authorization: Bearer <token>`

**Success Response (200):**
```json
{
  "success": true,
  "message": "Order tracking information retrieved successfully",
  "data": {
    "orderNumber": "ORD-2024-001234",
    "currentStatus": "shipped",
    "trackingNumber": "TRK123456789",
    "estimatedDelivery": "2024-01-20T00:00:00.000Z",
    "shippingAddress": {...},
    "timeline": [
      {
        "status": "Order Placed",
        "description": "Your order has been placed successfully",
        "timestamp": "2024-01-15T10:30:00.000Z",
        "completed": true
      },
      {
        "status": "Order Confirmed",
        "description": "Your order has been confirmed and is being processed",
        "timestamp": "2024-01-15T11:00:00.000Z",
        "completed": true
      },
      {
        "status": "Processing",
        "description": "Your order is being prepared for shipment",
        "timestamp": "2024-01-16T14:20:00.000Z",
        "completed": true
      },
      {
        "status": "Shipped",
        "description": "Your order has been shipped (Tracking: TRK123456789)",
        "timestamp": "2024-01-17T09:30:00.000Z",
        "completed": true
      },
      {
        "status": "Out for Delivery",
        "description": "Your order is out for delivery",
        "timestamp": "2024-01-19T10:00:00.000Z",
        "completed": false,
        "current": true
      }
    ],
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-17T09:30:00.000Z"
  }
}
```

---

## ❤️ Wishlist System

### Get Wishlist

**Endpoint:** `GET /api/wishlist`

**Headers:** 
- `Authorization: Bearer <token>`

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)
- `sortBy` (optional): Sort field (default: addedAt)
- `sortOrder` (optional): Sort order (asc, desc) (default: desc)

**Success Response (200):**
```json
{
  "success": true,
  "message": "Wishlist retrieved successfully",
  "data": {
    "items": [
      {
        "id": "64f8a1b2c3d4e5f6a7b8c9d4",
        "product": {
          "id": "64f8a1b2c3d4e5f6a7b8c9d5",
          "name": "Wireless Headphones",
          "slug": "wireless-headphones",
          "images": ["https://example.com/headphones.jpg"],
          "pricing": {
            "basePrice": 2999,
            "comparePrice": 3999
          },
          "status": "active",
          "category": {
            "name": "Electronics"
          }
        },
        "price": 2999,
        "addedAt": "2024-01-15T10:30:00.000Z",
        "inStock": true,
        "isAvailable": true
      }
    ],
    "totalCount": 8,
    "currentPage": 1,
    "totalPages": 1,
    "hasNextPage": false,
    "hasPrevPage": false
  }
}
```

### Add to Wishlist

**Endpoint:** `POST /api/wishlist`

**Headers:** 
- `Authorization: Bearer <token>`
- `Content-Type: application/json`

**Request Body:**
```json
{
  "productId": "64f8a1b2c3d4e5f6a7b8c9d5"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Product added to wishlist",
  "data": {
    "id": "64f8a1b2c3d4e5f6a7b8c9d4",
    "product": {
      "id": "64f8a1b2c3d4e5f6a7b8c9d5",
      "name": "Wireless Headphones",
      "slug": "wireless-headphones",
      "images": ["https://example.com/headphones.jpg"],
      "pricing": {
        "basePrice": 2999,
        "comparePrice": 3999
      },
      "status": "active"
    },
    "price": 2999,
    "addedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### Remove from Wishlist

**Endpoint:** `DELETE /api/wishlist/:productId`

**Headers:** 
- `Authorization: Bearer <token>`

**Success Response (200):**
```json
{
  "success": true,
  "message": "Product removed from wishlist"
}
```

### Move to Cart

**Endpoint:** `POST /api/wishlist/:productId/to-cart`

**Headers:** 
- `Authorization: Bearer <token>`
- `Content-Type: application/json`

**Request Body:**
```json
{
  "quantity": 1,
  "variant": {
    "color": "Black",
    "size": "Large"
  }
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Product moved to cart successfully",
  "data": {
    "cartCount": 5,
    "wishlistCount": 7
  }
}
```

---

## 🛒 Saved Carts System

### Get Saved Carts

**Endpoint:** `GET /api/saved-carts`

**Headers:** 
- `Authorization: Bearer <token>`

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `status` (optional): Filter by status (active, archived, converted)
- `sortBy` (optional): Sort field (default: createdAt)
- `sortOrder` (optional): Sort order (asc, desc) (default: desc)
- `search` (optional): Search by name, description, or tags

**Success Response (200):**
```json
{
  "success": true,
  "message": "Saved carts retrieved successfully",
  "data": [
    {
      "id": "64f8a1b2c3d4e5f6a7b8c9d6",
      "name": "Home Office Setup",
      "description": "Essential items for my home office",
      "itemCount": 5,
      "totalItems": 7,
      "totals": {
        "subtotal": 25000,
        "tax": 4500,
        "shipping": 0,
        "total": 29500
      },
      "isDefault": true,
      "isShared": false,
      "shareToken": null,
      "shareExpiresAt": null,
      "tags": ["office", "work", "essential"],
      "status": "active",
      "convertedAt": null,
      "convertedOrder": null,
      "createdAt": "2024-01-10T10:30:00.000Z",
      "updatedAt": "2024-01-15T14:20:00.000Z",
      "items": [
        {
          "id": "64f8a1b2c3d4e5f6a7b8c9d7",
          "product": {
            "id": "64f8a1b2c3d4e5f6a7b8c9d8",
            "name": "Ergonomic Chair",
            "slug": "ergonomic-chair",
            "images": ["https://example.com/chair.jpg"],
            "status": "active"
          },
          "variant": {
            "color": "Black"
          },
          "quantity": 1,
          "price": 8000,
          "total": 8000,
          "addedAt": "2024-01-10T10:30:00.000Z"
        }
      ]
    }
  ],
  "meta": {
    "total": 3,
    "page": 1,
    "limit": 10,
    "totalPages": 1,
    "hasNextPage": false,
    "hasPrevPage": false
  }
}
```

### Create Saved Cart

**Endpoint:** `POST /api/saved-carts`

**Headers:** 
- `Authorization: Bearer <token>`
- `Content-Type: application/json`

**Request Body:**
```json
{
  "name": "Birthday Wishlist",
  "description": "Items I want for my birthday",
  "items": [
    {
      "product": "64f8a1b2c3d4e5f6a7b8c9d8",
      "variant": {
        "color": "Red",
        "size": "Medium"
      },
      "quantity": 1
    }
  ],
  "tags": ["birthday", "wishlist", "personal"]
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Saved cart created successfully",
  "data": {
    "id": "64f8a1b2c3d4e5f6a7b8c9d9",
    "name": "Birthday Wishlist",
    "description": "Items I want for my birthday",
    "itemCount": 1,
    "totals": {
      "subtotal": 5000,
      "tax": 900,
      "shipping": 40,
      "total": 5940
    },
    "tags": ["birthday", "wishlist", "personal"],
    "createdAt": "2024-01-16T10:30:00.000Z"
  }
}
```

### Save Current Cart

**Endpoint:** `POST /api/saved-carts/save-current`

**Headers:** 
- `Authorization: Bearer <token>`
- `Content-Type: application/json`

**Request Body:**
```json
{
  "name": "Weekend Shopping",
  "description": "Items I plan to buy this weekend"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Cart saved successfully",
  "data": {
    "id": "64f8a1b2c3d4e5f6a7b8c9da",
    "name": "Weekend Shopping",
    "description": "Items I plan to buy this weekend",
    "itemCount": 3,
    "totals": {
      "subtotal": 15000,
      "tax": 2700,
      "shipping": 0,
      "total": 17700
    },
    "createdAt": "2024-01-16T11:00:00.000Z"
  }
}
```

### Restore Saved Cart

**Endpoint:** `POST /api/saved-carts/:id/restore`

**Headers:** 
- `Authorization: Bearer <token>`

**Success Response (200):**
```json
{
  "success": true,
  "message": "Saved cart restored to active cart",
  "data": {
    "message": "Cart restored successfully",
    "restoredItems": 5,
    "unavailableItems": [],
    "cartCount": 5,
    "cartTotal": 29500
  }
}
```

---

## 📊 Account Statistics

### Get Account Stats

**Endpoint:** `GET /api/user/stats`

**Headers:** 
- `Authorization: Bearer <token>`

**Success Response (200):**
```json
{
  "success": true,
  "message": "Account statistics retrieved successfully",
  "data": {
    "totalOrders": 15,
    "wishlistItems": 8,
    "savedCarts": 3,
    "memberSince": "2024-01-01T00:00:00.000Z",
    "lastLogin": "2024-01-15T10:30:00.000Z",
    "isEmailVerified": true,
    "isPhoneVerified": false
  }
}
```

### Get Order Statistics

**Endpoint:** `GET /api/orders/stats`

**Headers:** 
- `Authorization: Bearer <token>`

**Success Response (200):**
```json
{
  "success": true,
  "message": "Order statistics retrieved successfully",
  "data": {
    "totalOrders": 15,
    "pendingOrders": 2,
    "completedOrders": 12,
    "cancelledOrders": 1,
    "totalSpent": 125000,
    "recentOrders": [
      {
        "orderNumber": "ORD-2024-001234",
        "status": "delivered",
        "total": 53100,
        "date": "2024-01-15T00:00:00.000Z"
      }
    ]
  }
}
```

---

## 🏠 Address Management

### Get Addresses

**Endpoint:** `GET /api/user/addresses`

**Headers:** 
- `Authorization: Bearer <token>`

**Success Response (200):**
```json
{
  "success": true,
  "message": "Addresses retrieved successfully",
  "data": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9db",
      "type": "home",
      "street": "123 Commerce Street",
      "city": "Mumbai",
      "state": "Maharashtra",
      "zipCode": "400001",
      "country": "India",
      "isDefault": true
    },
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9dc",
      "type": "work",
      "street": "456 Office Complex",
      "city": "Bangalore",
      "state": "Karnataka",
      "zipCode": "560001",
      "country": "India",
      "isDefault": false
    }
  ]
}
```

### Add Address

**Endpoint:** `POST /api/user/addresses`

**Headers:** 
- `Authorization: Bearer <token>`
- `Content-Type: application/json`

**Request Body:**
```json
{
  "type": "home",
  "street": "789 New Street",
  "city": "Delhi",
  "state": "Delhi",
  "zipCode": "110001",
  "country": "India",
  "isDefault": false
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Address added successfully",
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9dd",
    "type": "home",
    "street": "789 New Street",
    "city": "Delhi",
    "state": "Delhi",
    "zipCode": "110001",
    "country": "India",
    "isDefault": false
  }
}
```

---

## ❌ Error Responses

### Standard Error Format
```json
{
  "success": false,
  "message": "Error description",
  "code": "ERROR_CODE",
  "errors": [
    {
      "field": "fieldName",
      "message": "Validation error message",
      "value": "submitted value"
    }
  ]
}
```

### Common Error Codes

| Status Code | Error Code | Description |
|-------------|------------|-------------|
| 400 | VALIDATION_ERROR | Request validation failed |
| 401 | UNAUTHORIZED | Authentication required |
| 403 | INSUFFICIENT_PERMISSIONS | Permission denied |
| 404 | NOT_FOUND | Resource not found |
| 409 | EMAIL_EXISTS | Email already in use |
| 422 | PRODUCT_UNAVAILABLE | Product not available |
| 429 | RATE_LIMIT_EXCEEDED | Too many requests |
| 500 | INTERNAL_SERVER_ERROR | Server error |

### Example Error Responses

**Validation Error (400):**
```json
{
  "success": false,
  "message": "Validation failed",
  "code": "VALIDATION_ERROR",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email address",
      "value": "invalid-email"
    },
    {
      "field": "phone",
      "message": "Please provide a valid 10-digit Indian mobile number",
      "value": "12345"
    }
  ]
}
```

**Authentication Error (401):**
```json
{
  "success": false,
  "message": "Access denied. No token provided.",
  "code": "NO_TOKEN"
}
```

**Not Found Error (404):**
```json
{
  "success": false,
  "message": "Order not found",
  "code": "NOT_FOUND"
}
```

---

## 🚦 Rate Limiting

### Rate Limits by Endpoint

| Endpoint | Limit | Time Window |
|----------|-------|-------------|
| Profile Updates | 5 requests | 1 hour |
| Password Change | 3 requests | 1 hour |
| Order Actions | 10 requests | 1 hour |
| Wishlist Actions | 20 requests | 1 hour |
| Saved Cart Actions | 20 requests | 1 hour |
| General Requests | 100 requests | 1 hour |

### Rate Limit Response (429)
```json
{
  "success": false,
  "message": "Too many requests. Please try again later.",
  "code": "RATE_LIMIT_EXCEEDED",
  "retryAfter": 3600
}
```

---

## 🧪 Testing with Postman

### Environment Variables
```json
{
  "baseUrl": "http://localhost:5000/api",
  "token": "your-jwt-token-here"
}
```

### Example Collection

**1. Get Profile:**
- Method: GET
- URL: `{{baseUrl}}/user/profile`
- Headers: `Authorization: Bearer {{token}}`

**2. Update Profile:**
- Method: PUT
- URL: `{{baseUrl}}/user/profile`
- Headers: 
  - `Authorization: Bearer {{token}}`
  - `Content-Type: application/json`
- Body: Raw JSON with profile data

**3. Get Orders:**
- Method: GET
- URL: `{{baseUrl}}/orders?page=1&limit=10`
- Headers: `Authorization: Bearer {{token}}`

**4. Add to Wishlist:**
- Method: POST
- URL: `{{baseUrl}}/wishlist`
- Headers: 
  - `Authorization: Bearer {{token}}`
  - `Content-Type: application/json`
- Body: `{"productId": "product-id-here"}`

---

## 📝 Notes

1. **Authentication**: All protected routes require a valid JWT token
2. **Pagination**: Most list endpoints support pagination with `page` and `limit` parameters
3. **Sorting**: Sortable endpoints support `sortBy` and `sortOrder` parameters
4. **Search**: Search endpoints use case-insensitive partial matching
5. **Rate Limiting**: Implemented to prevent abuse
6. **Validation**: All inputs are validated before processing
7. **Error Handling**: Consistent error response format across all endpoints
8. **Timestamps**: All timestamps are in ISO 8601 format (UTC)
9. **Currency**: All monetary values are in INR (₹)
10. **Phone Numbers**: Expected in Indian format (10 digits starting with 6-9)

---

## 🔗 Related Documentation

- [Authentication API](./AUTH_API.md)
- [Products API](./PRODUCTS_API.md)
- [Cart API](./CART_API.md)
- [Payments API](./PAYMENTS_API.md)

---

*Last Updated: January 2024*
