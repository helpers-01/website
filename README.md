# Helpers Platform 🏠✨

A production-ready full-stack platform connecting service providers with customers (Urban Company clone). Built with Next.js, Express.js, TypeScript, and Supabase.

## 🚀 Live Demo
- **Frontend**: [https://your-domain.com](https://your-domain.com)
- **API**: [https://api.your-domain.com](https://api.your-domain.com)
- **API Health**: [https://api.your-domain.com/health](https://api.your-domain.com/health)

## 📋 Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Quick Start](#quick-start)
- [Development](#development)
- [Deployment](#deployment)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)

## ✨ Features

### For Customers
- 🔍 **Service Discovery**: Browse and search services by category, location, price
- 👤 **Provider Profiles**: View detailed provider profiles with ratings and reviews
- 📅 **Easy Booking**: Simple booking flow with real-time availability
- 💬 **Reviews & Ratings**: Leave reviews and ratings for completed services
- 📱 **Mobile Responsive**: Fully responsive design for all devices

### For Service Providers
- 🏢 **Business Profile**: Create detailed business profiles with portfolio
- 📋 **Service Management**: Manage offered services and pricing
- ⏰ **Availability Scheduling**: Set working hours and availability
- 📊 **Booking Dashboard**: Manage incoming bookings and schedule
- 📈 **Analytics**: Track earnings, ratings, and business performance

### For Administrators
- 👥 **User Management**: Manage customers and providers
- 🔧 **Service Management**: Create and manage service categories
- ✅ **Provider Verification**: Verify and approve new providers
- 📊 **Platform Analytics**: Monitor platform usage and performance

## 🛠 Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Modern, accessible UI components
- **React Hook Form** - Form handling with validation
- **Zod** - Schema validation

### Backend
- **Express.js** - Fast, minimal web framework
- **TypeScript** - Type-safe server development
- **Supabase** - Backend-as-a-Service with PostgreSQL
- **JWT** - Secure authentication tokens
- **Winston** - Structured logging
- **Helmet** - Security middleware
- **Multer** - File upload handling

### Database
- **PostgreSQL** - Primary database via Supabase
- **Row Level Security** - Fine-grained access control
- **Real-time subscriptions** - Live data updates
- **Redis** - Caching layer (optional)

### DevOps
- **Docker** - Containerization
- **GitHub Actions** - CI/CD pipeline
- **Vercel** - Frontend hosting
- **Fly.io** - Backend hosting
- **Sentry** - Error monitoring

## 📁 Project Structure

```
project-root/
├── client/                 # Next.js frontend application
│   ├── app/               # Next.js App Router pages
│   ├── components/        # Reusable UI components
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Client-side utilities
│   ├── public/           # Static assets
│   └── styles/           # Global styles
├── server/                # Express.js backend application
│   ├── src/
│   │   ├── config/       # Configuration files
│   │   ├── middleware/   # Express middleware
│   │   ├── routes/       # API route handlers
│   │   ├── services/     # Business logic layer
│   │   └── utils/        # Server utilities
│   ├── Dockerfile        # Production Docker image
│   └── Dockerfile.dev    # Development Docker image
├── shared/                # Shared code between client and server
│   ├── types/            # TypeScript type definitions
│   ├── utils/            # Shared utility functions
│   └── validation/       # Validation schemas
├── docs/                  # Project documentation
│   ├── api/              # API documentation
│   ├── architecture/     # Architecture decisions
│   └── deployment/       # Deployment guides
├── scripts/               # Automation and deployment scripts
│   ├── migrate.js        # Database migration script
│   └── deploy.js         # Production deployment script
├── .github/workflows/     # GitHub Actions CI/CD
├── docker-compose.yml     # Local development environment
├── .env.template         # Environment variables template
└── README.md             # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or pnpm
- Docker (optional, for local development)
- Supabase account

### 1. Clone and Install
```bash
git clone https://github.com/your-username/helpers-platform.git
cd helpers-platform

# Install dependencies for all workspaces
npm install
```

### 2. Environment Setup
```bash
# Copy environment template
cp .env.template .env

# Edit .env with your Supabase credentials
# Get these from: https://supabase.com/dashboard/project/your-project/settings/api
```

### 3. Database Setup
```bash
# Run database migrations
node scripts/migrate.js

# Or manually run SQL in Supabase SQL Editor
```

### 4. Start Development Servers

**Option A: Using Docker (Recommended)**
```bash
docker-compose up
```

**Option B: Manual Start**
```bash
# Terminal 1: Start backend
cd server
npm run dev

# Terminal 2: Start frontend  
cd client
npm run dev
```

### 5. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **API Health**: http://localhost:3001/health

## 🔧 Development

### Available Scripts

**Root Level:**
```bash
npm run dev          # Start frontend in development
npm run build        # Build frontend for production
npm run start        # Start frontend in production
npm run server       # Start backend server
```

**Client (Frontend):**
```bash
cd client
npm run dev          # Start Next.js dev server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler
```

**Server (Backend):**
```bash
cd server
npm run dev          # Start with nodemon (auto-reload)
npm run build        # Compile TypeScript to JavaScript
npm run start        # Start production server
npm run test         # Run tests
npm run lint         # Run ESLint
```

### Code Quality
The project includes:
- **ESLint** - Code linting
- **TypeScript** - Type checking
- **Prettier** - Code formatting (recommended)
- **Husky** - Git hooks for pre-commit checks

### Testing
```bash
# Run all tests
npm test

# Run frontend tests
npm test --workspace client

# Run backend tests
npm test --workspace server
```

## 🚀 Deployment

### Automated Deployment (Recommended)
1. Push to `main` branch
2. GitHub Actions automatically deploys to production
3. Monitor deployment in GitHub Actions tab

### Manual Deployment
```bash
# Deploy everything
node scripts/deploy.js

# Deploy specific components
node scripts/deploy.js frontend
node scripts/deploy.js backend
node scripts/deploy.js dns
```

### Production URLs
After successful deployment:
- **Frontend**: `https://your-domain.com`
- **Backend API**: `https://helpers-platform-api.fly.dev`
- **Custom API**: `https://api.your-domain.com` (if configured)

For detailed deployment instructions, see [Deployment Guide](docs/deployment/README.md).

## 📚 API Documentation

The API is RESTful and follows OpenAPI 3.0 specification.

### Quick API Examples

**Register User:**
```bash
curl -X POST https://api.your-domain.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securepassword",
    "full_name": "John Doe",
    "role": "customer"
  }'
```

**Get Services:**
```bash
curl https://api.your-domain.com/api/services?category=cleaning&location=NYC
```

**Create Booking (requires auth):**
```bash
curl -X POST https://api.your-domain.com/api/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-jwt-token" \
  -d '{
    "service_id": "service-uuid",
    "provider_id": "provider-uuid",
    "booking_date": "2024-01-15",
    "start_time": "10:00",
    "address": {...}
  }'
```

For complete API documentation, see [API Docs](docs/api/README.md).

## 🏗 Architecture

The application follows a modern, scalable architecture:

- **Frontend**: Next.js app deployed on Vercel
- **Backend**: Express.js API deployed on Fly.io
- **Database**: Supabase PostgreSQL with Row Level Security
- **Authentication**: Supabase Auth with JWT tokens
- **File Storage**: Supabase Storage or AWS S3
- **Caching**: Redis for session and response caching

For detailed architecture information, see [Architecture Docs](docs/architecture/README.md).

## 🔒 Security Features

- **Authentication**: JWT-based with Supabase Auth
- **Authorization**: Role-based access control (RBAC)
- **Rate Limiting**: Prevents API abuse
- **Input Validation**: Zod schema validation
- **SQL Injection Prevention**: Parameterized queries
- **XSS Protection**: Helmet.js security headers
- **CORS Configuration**: Controlled cross-origin requests
- **File Upload Security**: Type and size restrictions

## 🧪 Testing

The project includes comprehensive testing:

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write tests for new features
- Follow the existing code style
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you have any questions or need help:
- 📧 Email: support@your-domain.com
- 🐛 Issues: [GitHub Issues](https://github.com/your-username/helpers-platform/issues)
- 📖 Documentation: [docs/](docs/)

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Powered by [Supabase](https://supabase.com/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Deployed on [Vercel](https://vercel.com/) and [Fly.io](https://fly.io/)

---

**Built with ❤️ for the modern web**
