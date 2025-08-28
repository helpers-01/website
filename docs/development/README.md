# Development Guide

## 🚀 Getting Started

### Prerequisites
- **Node.js 18+** - [Download](https://nodejs.org/)
- **npm or pnpm** - Package manager
- **Git** - Version control
- **Docker** (optional) - For containerized development
- **VS Code** (recommended) - With suggested extensions

### Recommended VS Code Extensions
```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode", 
    "ms-vscode.vscode-typescript-next",
    "ms-vscode.vscode-eslint",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense",
    "ms-vscode.vscode-json"
  ]
}
```

## 📁 Project Setup

### 1. Environment Configuration
```bash
# Copy environment template
cp .env.template .env

# Fill in your Supabase credentials
# Get from: https://supabase.com/dashboard/project/your-project/settings/api
```

**Required Environment Variables:**
```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_JWT_SECRET=your-jwt-secret
JWT_SECRET=your-custom-jwt-secret
```

### 2. Database Setup
```bash
# Run database migrations
npm run db:migrate

# Seed with sample data (optional)
npm run db:seed
```

### 3. Install Dependencies
```bash
# Install all workspace dependencies
npm install

# Or install individually
npm install --workspace client
npm install --workspace server
```

## 🏃‍♂️ Running the Application

### Option A: Docker Compose (Recommended)
```bash
# Start all services
npm run docker:up

# With monitoring stack
npm run monitoring:up

# View logs
npm run docker:logs

# Stop services
npm run docker:down
```

**Available Services:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- Redis: localhost:6379
- Nginx: http://localhost:80
- Prometheus: http://localhost:9090 (with monitoring profile)
- Grafana: http://localhost:3002 (with monitoring profile)

### Option B: Manual Start
```bash
# Terminal 1: Start backend
npm run dev:server

# Terminal 2: Start frontend
npm run dev

# Or both simultaneously
npm run dev:all
```

## 🛠️ Development Workflow

### Code Quality
```bash
# Run linting
npm run lint

# Fix linting issues
npm run lint:fix

# Type checking
npm run type-check

# Run tests
npm run test

# Security audit
npm run security:audit
```

### Database Operations
```bash
# Run migrations
npm run db:migrate

# Seed database
npm run db:seed

# Connect to local database (if using Docker)
docker-compose exec postgres psql -U postgres -d helpers_app
```

### File Structure Guidelines

**Frontend (`client/`):**
```
app/                    # Next.js App Router
├── (auth)/            # Auth-related pages
├── (dashboard)/       # Dashboard layouts
├── api/               # API routes (if any)
├── globals.css        # Global styles
├── layout.tsx         # Root layout
└── page.tsx           # Home page

components/             # Reusable components
├── ui/                # Base UI components (shadcn/ui)
├── forms/             # Form components
├── layout/            # Layout components
└── features/          # Feature-specific components

hooks/                 # Custom React hooks
lib/                   # Client utilities and configurations
public/                # Static assets
```

**Backend (`server/src/`):**
```
config/                # Configuration files
├── supabase.ts        # Database client
├── redis.ts           # Cache client
└── constants.ts       # App constants

middleware/            # Express middleware
├── auth.ts            # Authentication middleware
├── errorHandler.ts    # Error handling
├── requestLogger.ts   # Request logging
└── validation.ts      # Request validation

routes/                # API route handlers
├── auth.ts            # Authentication routes
├── services.ts        # Service management
├── providers.ts       # Provider management
├── bookings.ts        # Booking management
└── reviews.ts         # Review system

services/              # Business logic layer
├── userService.ts     # User operations
├── serviceService.ts  # Service operations
├── bookingService.ts  # Booking operations
└── emailService.ts    # Email notifications

utils/                 # Server utilities
├── logger.ts          # Logging configuration
├── helpers.ts         # General utilities
└── validators.ts      # Custom validators
```

## 🧪 Testing

### Test Structure
```bash
client/
├── __tests__/         # Component tests
├── e2e/              # End-to-end tests
└── jest.config.js    # Jest configuration

server/
├── __tests__/        # API tests
├── integration/      # Integration tests
└── jest.config.js    # Jest configuration
```

### Running Tests
```bash
# Run all tests
npm test

# Run client tests only
npm run test:client

# Run server tests only  
npm run test:server

# Run with coverage
npm test -- --coverage

# Run specific test file
npm test -- UserService.test.ts
```

### Writing Tests

**Component Test Example:**
```typescript
// client/__tests__/components/ServiceCard.test.tsx
import { render, screen } from '@testing-library/react';
import { ServiceCard } from '@/components/ServiceCard';

describe('ServiceCard', () => {
  const mockService = {
    id: '1',
    name: 'House Cleaning',
    description: 'Professional cleaning service',
    base_price: 100,
    duration_minutes: 120,
  };

  it('renders service information', () => {
    render(<ServiceCard service={mockService} />);
    
    expect(screen.getByText('House Cleaning')).toBeInTheDocument();
    expect(screen.getByText('$100')).toBeInTheDocument();
  });
});
```

**API Test Example:**
```typescript
// server/__tests__/routes/auth.test.ts
import request from 'supertest';
import app from '../../src/app';

describe('Authentication API', () => {
  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
          full_name: 'Test User',
          role: 'customer'
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
    });
  });
});
```

## 🔄 Development Best Practices

### Code Style
- **TypeScript**: Use strict mode, proper typing
- **ESLint**: Follow configured rules
- **Prettier**: Auto-format on save
- **Commit Messages**: Use conventional commits

### Git Workflow
```bash
# Create feature branch
git checkout -b feature/user-authentication

# Make changes and commit
git add .
git commit -m "feat: add user authentication middleware"

# Push and create PR
git push origin feature/user-authentication
```

### Database Changes
```bash
# Always create migrations for schema changes
# Edit scripts/migrate.js to add new migration

# Test migration locally
npm run db:migrate

# Commit migration with your code changes
git add scripts/migrate.js
git commit -m "feat: add provider availability table"
```

### Environment Management
```bash
# Development
cp .env.template .env.local

# Staging
cp .env.template .env.staging  

# Production
cp .env.template .env.production
```

## 🐛 Debugging

### Backend Debugging
```bash
# Enable debug logging
DEBUG=helpers:* npm run dev:server

# View detailed logs
npm run docker:logs server

# Connect to running container
docker-compose exec server sh
```

### Frontend Debugging
```bash
# Enable Next.js debugging
DEBUG=next* npm run dev

# Check build analysis
npm run build
npm run analyze
```

### Database Debugging
```bash
# View Supabase logs
# Go to Supabase Dashboard → Logs

# Test database connection
node -e "require('./server/src/config/supabase').testConnection()"
```

## 🔧 Common Development Tasks

### Adding New API Endpoint
1. **Define types** in `shared/types/`
2. **Add validation schema** in `shared/validation/`
3. **Create service method** in `server/src/services/`
4. **Add route handler** in `server/src/routes/`
5. **Write tests** for the new endpoint
6. **Update API documentation**

### Adding New Frontend Component
1. **Create component** in `client/components/`
2. **Add TypeScript types** if needed
3. **Write component tests** in `client/__tests__/`
4. **Add to Storybook** (if configured)
5. **Update documentation**

### Database Schema Changes
1. **Plan migration** carefully
2. **Add migration** to `scripts/migrate.js`
3. **Update TypeScript types** in `shared/types/database.ts`
4. **Test migration** locally
5. **Update affected services** and routes

## 📚 Resources

### Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [Supabase Docs](https://supabase.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)

### Tools & Extensions
- [React Developer Tools](https://react.dev/learn/react-developer-tools)
- [Redux DevTools](https://github.com/reduxjs/redux-devtools)
- [Postman](https://www.postman.com/) - API testing
- [TablePlus](https://tableplus.com/) - Database client

### Learning Resources
- [React Patterns](https://reactpatterns.com/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [TypeScript Best Practices](https://typescript-eslint.io/rules/)
- [API Design Best Practices](https://docs.microsoft.com/en-us/azure/architecture/best-practices/api-design)

## 🆘 Getting Help

### Team Communication
- **Slack**: #helpers-platform-dev
- **Email**: dev-team@your-domain.com
- **Issues**: Create GitHub issue with detailed description

### Debugging Checklist
When you encounter issues:

1. **Check logs**: Application and container logs
2. **Verify environment**: Ensure all required env vars are set
3. **Test database**: Verify database connectivity
4. **Check dependencies**: Ensure all packages are installed
5. **Clear cache**: Clear Next.js and npm cache
6. **Restart services**: Fresh start often resolves issues

### Common Issues

**Port already in use:**
```bash
# Kill processes on ports
npx kill-port 3000 3001

# Or use different ports
PORT=3002 npm run dev:server
```

**Database connection issues:**
```bash
# Test Supabase connection
node -e "console.log(process.env.SUPABASE_URL)"

# Verify credentials in Supabase dashboard
```

**Build errors:**
```bash
# Clear caches
rm -rf .next node_modules package-lock.json
npm install
npm run build
```
