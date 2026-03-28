# 🛍️ Dropship Ecommerce Platform

A complete production-ready dropshipping ecommerce website built with modern technologies, featuring a premium UI similar to Amazon/Shopify stores with powerful backend logic and scalable architecture.

## 🚀 Features

### 🛒 Core Ecommerce Features
- **User Management**: Registration, login, Google OAuth, profile management
- **Product Catalog**: Advanced filtering, search, categories, variants
- **Shopping Cart**: Persistent cart with localStorage + database sync
- **Checkout System**: Multi-step checkout with payment integration
- **Order Management**: Complete order lifecycle with tracking
- **Dropshipping Logic**: Supplier integration and auto-forwarding
- **Admin Dashboard**: Comprehensive analytics and management

### 🎨 Premium UI/UX
- **Modern Design**: Apple/Amazon/Nike-inspired interface
- **Responsive**: Mobile-first design with Tailwind CSS
- **Animations**: Smooth transitions with Framer Motion
- **Dark/Light Theme**: System theme support
- **Accessibility**: WCAG compliant components

### 🔧 Technical Features
- **TypeScript**: Full type safety
- **SEO Optimized**: Dynamic meta tags, sitemap generation
- **Performance**: Lazy loading, image optimization, code splitting
- **Security**: JWT auth, rate limiting, XSS protection
- **Scalability**: Microservices-ready architecture

## 📁 Project Structure

```
ecommerce-dropship/
├── frontend/                 # Next.js Frontend
│   ├── app/                 # App Router Pages
│   ├── components/           # Reusable Components
│   ├── hooks/              # Custom Hooks
│   ├── lib/                # Utilities & Config
│   ├── store/              # State Management
│   └── types/              # TypeScript Types
├── backend/                 # Express.js Backend
│   └── src/
│       ├── controllers/    # API Controllers
│       ├── models/         # Database Models
│       ├── routes/         # API Routes
│       ├── middleware/     # Custom Middleware
│       ├── services/       # Business Logic
│       └── utils/          # Utilities
├── docs/                   # Documentation
└── scripts/               # Utility Scripts
```

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + CSS Variables
- **Animations**: Framer Motion
- **State**: Zustand
- **Forms**: React Hook Form + Zod
- **UI Components**: Radix UI + Custom
- **HTTP Client**: Axios + React Query

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB + Mongoose
- **Authentication**: JWT + Passport.js
- **Validation**: Joi + Express Validator
- **File Upload**: Multer + Cloudinary
- **Email**: Nodemailer
- **Payments**: Stripe + Razorpay

### Development & Deployment
- **Frontend**: Vercel
- **Backend**: Railway/Render
- **Database**: MongoDB Atlas
- **CI/CD**: GitHub Actions
- **Monitoring**: Winston + Morgan

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB 5+
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/your-username/ecommerce-dropship.git
cd ecommerce-dropship
```

2. **Install dependencies**
```bash
# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install
```

3. **Environment Setup**

**Frontend (.env.local)**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
NEXT_PUBLIC_RAZORPAY_KEY=your_razorpay_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_key
```

**Backend (.env)**
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/dropship-ecommerce
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
STRIPE_SECRET_KEY=your_stripe_secret
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
```

4. **Start Development Servers**

**Backend**
```bash
cd backend
npm run dev
```

**Frontend** (in separate terminal)
```bash
cd frontend
npm run dev
```

5. **Access the Application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- API Health Check: http://localhost:5000/api/health

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/google` - Google OAuth
- `POST /api/auth/logout` - User logout
- `POST /api/auth/forgot-password` - Password reset

### Product Endpoints
- `GET /api/products` - Get products with filtering
- `GET /api/products/:slug` - Get single product
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Cart Endpoints
- `GET /api/cart` - Get user cart
- `POST /api/cart` - Add to cart
- `PUT /api/cart/:id` - Update cart item
- `DELETE /api/cart/:id` - Remove from cart

### Order Endpoints
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create order
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id` - Update order status

## 🎯 Core Features Implementation

### 1. User Authentication
- JWT-based authentication with refresh tokens
- Google OAuth integration
- Email verification
- Password reset functionality
- Role-based access control

### 2. Product Management
- Advanced product catalog with variants
- Multi-level categories and subcategories
- Product search with full-text search
- Image gallery with zoom functionality
- Product reviews and ratings system
- Inventory management with low stock alerts

### 3. Shopping Cart
- Persistent cart using localStorage
- Real-time cart synchronization
- Quantity management
- Cart sharing across devices
- Guest cart support

### 4. Checkout Process
- Multi-step checkout wizard
- Address management
- Multiple payment methods
- Coupon/discount codes
- Order confirmation emails

### 5. Dropshipping Logic
- Supplier product synchronization
- Automatic order forwarding
- Inventory updates from suppliers
- Tracking integration
- Profit calculation

### 6. Admin Dashboard
- Product management interface
- Order management system
- Customer management
- Supplier management
- Analytics and reporting
- Revenue tracking

## 🔒 Security Features

- **Authentication**: JWT with refresh tokens
- **Authorization**: Role-based access control
- **Input Validation**: Comprehensive input sanitization
- **Rate Limiting**: API request throttling
- **XSS Protection**: Cross-site scripting prevention
- **CSRF Protection**: Cross-site request forgery prevention
- **Data Encryption**: Sensitive data encryption
- **Secure Headers**: Helmet.js security headers

## 🚀 Performance Optimization

### Frontend
- **Code Splitting**: Automatic route-based splitting
- **Lazy Loading**: Components and images
- **Image Optimization**: Next.js Image component
- **Bundle Analysis**: Webpack bundle analyzer
- **Caching**: HTTP caching strategies

### Backend
- **Database Indexing**: Optimized queries
- **Caching**: Redis for frequently accessed data
- **Compression**: Gzip compression
- **Connection Pooling**: Database connection management
- **API Caching**: Response caching

## 📈 Analytics & Monitoring

- **User Analytics**: Page views, user behavior
- **Sales Analytics**: Revenue, conversion rates
- **Product Analytics**: Popular products, search terms
- **Performance Monitoring**: Response times, error rates
- **Error Tracking**: Comprehensive error logging

## 🌍 SEO Optimization

- **Meta Tags**: Dynamic OpenGraph and Twitter cards
- **Structured Data**: JSON-LD schema markup
- **Sitemap**: Automatic sitemap generation
- **Robots.txt**: Search engine crawling instructions
- **URL Structure**: SEO-friendly URLs
- **Image Alt Tags**: Accessibility and SEO

## 🧪 Testing

### Frontend Testing
- **Unit Tests**: Jest + React Testing Library
- **Integration Tests**: Component integration
- **E2E Tests**: Playwright for user flows

### Backend Testing
- **Unit Tests**: Jest for controllers and services
- **Integration Tests**: API endpoint testing
- **Load Testing**: Artillery for performance testing

## 📦 Deployment

### Frontend (Vercel)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Backend (Railway/Render)
```bash
# Build and deploy
npm run build
npm start
```

### Environment Variables
Configure all environment variables in your deployment platform:
- Database URLs
- API keys
- JWT secrets
- Email credentials
- Payment gateway keys

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, please contact:
- Email: support@dropship-ecommerce.com
- GitHub Issues: [Create an issue](https://github.com/your-username/ecommerce-dropship/issues)
- Documentation: [View docs](./docs/)

## 🎉 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [MongoDB](https://www.mongodb.com/) - Document database
- [Express.js](https://expressjs.com/) - Web framework
- [Vercel](https://vercel.com/) - Hosting platform

---

**Built with ❤️ for the dropshipping community**
