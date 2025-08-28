# Production Deployment Guide

## Prerequisites

Before deploying, ensure you have:
- [x] Supabase project set up
- [x] Custom domain ready
- [x] GitHub repository configured
- [x] Required CLI tools installed

### Required CLI Tools
```bash
# Install Vercel CLI
npm install -g vercel

# Install Fly CLI
curl -L https://fly.io/install.sh | sh
# Or on Windows: iwr https://fly.io/install.ps1 -useb | iex

# Install Supabase CLI (optional)
npm install -g supabase
```

## Step 1: Database Setup

### 1.1 Supabase Configuration
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Create a new project or use existing
3. Note down your project URL and keys
4. Run database migrations:

```bash
node scripts/migrate.js
```

**Or manually run the SQL in Supabase SQL Editor:**
- Copy SQL from `scripts/migrate.js` migrations array
- Run each migration in order

### 1.2 Environment Variables
Copy environment variables template:
```bash
cp .env.template .env.production
```

Fill in production values in `.env.production`:
```bash
# Update these with your actual production values
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_JWT_SECRET=your-jwt-secret
```

## Step 2: Backend Deployment (Fly.io)

### 2.1 Fly.io Setup
```bash
# Login to Fly.io
flyctl auth login

# Navigate to server directory
cd server

# Create Fly app
flyctl apps create helpers-platform-api

# Set production secrets
flyctl secrets set \
  SUPABASE_URL=https://your-project.supabase.co \
  SUPABASE_SERVICE_ROLE_KEY=your-service-role-key \
  SUPABASE_ANON_KEY=your-anon-key \
  SUPABASE_JWT_SECRET=your-jwt-secret \
  JWT_SECRET=your-custom-jwt-secret \
  CORS_ORIGIN=https://your-domain.com,https://www.your-domain.com
```

### 2.2 Deploy Backend
```bash
# Deploy to Fly.io
flyctl deploy

# Check deployment status
flyctl status

# View logs
flyctl logs
```

Your backend will be available at: `https://helpers-platform-api.fly.dev`

### 2.3 Custom Domain for API (Optional)
```bash
# Add custom domain certificate
flyctl certs create api.your-domain.com

# Check certificate status
flyctl certs show api.your-domain.com
```

## Step 3: Frontend Deployment (Vercel)

### 3.1 Vercel Setup
```bash
# Login to Vercel
vercel login

# Navigate to client directory
cd client

# Link to Vercel project
vercel link
```

### 3.2 Environment Variables in Vercel
Set these in Vercel Dashboard or via CLI:

```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
vercel env add NEXT_PUBLIC_API_URL production
```

Values:
- `NEXT_PUBLIC_SUPABASE_URL`: `https://your-project.supabase.co`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: `your-anon-key`
- `NEXT_PUBLIC_API_URL`: `https://helpers-platform-api.fly.dev/api`

### 3.3 Deploy Frontend
```bash
# Deploy to production
vercel --prod
```

## Step 4: Domain Configuration

### 4.1 DNS Records Setup
Add these DNS records in your domain provider:

**For Frontend (Vercel):**
```
Type: CNAME
Name: @
Value: cname.vercel-dns.com

Type: CNAME  
Name: www
Value: cname.vercel-dns.com
```

**For Backend API (Fly.io):**
```
Type: CNAME
Name: api
Value: helpers-platform-api.fly.dev
```

### 4.2 Domain Configuration in Platforms

**Vercel:**
1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add `your-domain.com` and `www.your-domain.com`
3. Wait for DNS propagation

**Fly.io (if using custom API domain):**
1. SSL certificates are automatically generated
2. Verify with: `flyctl certs show api.your-domain.com`

## Step 5: GitHub Actions Setup

### 5.1 Repository Secrets
Add these secrets in GitHub → Settings → Secrets and variables → Actions:

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_JWT_SECRET=your-jwt-secret
FLY_API_TOKEN=your-fly-api-token
VERCEL_TOKEN=your-vercel-token
```

### 5.2 Get Required Tokens

**Fly.io API Token:**
```bash
flyctl auth token
```

**Vercel Token:**
1. Go to Vercel → Settings → Tokens
2. Create new token
3. Copy token value

### 5.3 Automatic Deployments
After setup, pushes to `main` branch will automatically:
1. Run tests and security scans
2. Deploy backend to Fly.io
3. Deploy frontend to Vercel
4. Run health checks

## Step 6: Post-Deployment Verification

### 6.1 Health Checks
```bash
# Check backend API
curl https://api.your-domain.com/health

# Check frontend
curl https://your-domain.com

# Test API endpoint
curl https://api.your-domain.com/api/services/categories
```

### 6.2 Database Verification
1. Log into Supabase Dashboard
2. Check Tables tab - verify all tables exist
3. Check Authentication tab - test user registration
4. Check API tab - verify API keys work

### 6.3 Functional Testing
1. **User Registration**: Create test accounts
2. **Authentication**: Test login/logout
3. **Service Browsing**: Browse available services
4. **Booking Flow**: Create test booking
5. **Review System**: Leave test review

## Step 7: Production Configuration

### 7.1 Environment Updates
Update production environment variables:

```bash
# Update API URL to use custom domain
NEXT_PUBLIC_API_URL=https://api.your-domain.com/api
CORS_ORIGIN=https://your-domain.com,https://www.your-domain.com
```

### 7.2 Security Configuration
- [ ] Enable Supabase RLS policies
- [ ] Configure proper CORS origins
- [ ] Set up rate limiting alerts
- [ ] Enable security headers
- [ ] Set up SSL/TLS certificates

### 7.3 Monitoring Setup
- [ ] Configure Sentry for error tracking
- [ ] Set up uptime monitoring
- [ ] Configure log aggregation
- [ ] Set up performance monitoring

## Troubleshooting

### Common Issues

**Build Failures:**
```bash
# Clear caches and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Database Connection Issues:**
- Verify Supabase URL and keys
- Check network connectivity
- Verify RLS policies

**CORS Errors:**
- Check CORS_ORIGIN environment variable
- Verify domain configuration
- Check Supabase settings

**Authentication Issues:**
- Verify JWT secrets match
- Check Supabase auth configuration
- Validate token expiration settings

### Logs and Debugging

**Backend Logs (Fly.io):**
```bash
flyctl logs -a helpers-platform-api
```

**Frontend Logs (Vercel):**
- Check Vercel Dashboard → Functions tab
- View real-time logs in dashboard

**Database Logs (Supabase):**
- Supabase Dashboard → Logs section
- Filter by SQL queries, Auth events, etc.

## Scaling and Maintenance

### Auto-Scaling Configuration
**Fly.io Backend:**
```toml
# In fly.toml
[http_service]
  auto_stop_machines = true
  auto_start_machines = true
  min_machines_running = 1
```

**Vercel Frontend:**
- Automatic scaling included
- CDN caching globally distributed
- Serverless functions auto-scale

### Regular Maintenance Tasks
- [ ] Weekly dependency updates
- [ ] Monthly security patches
- [ ] Quarterly performance reviews
- [ ] Database maintenance and optimization

### Monitoring Alerts
Set up alerts for:
- [ ] API response time > 2s
- [ ] Error rate > 1%
- [ ] Database connection issues
- [ ] SSL certificate expiration
- [ ] High resource usage

## Cost Optimization

### Fly.io (Backend)
- Use shared CPU instances for development
- Scale down during low traffic periods
- Monitor resource usage

### Vercel (Frontend)
- Optimize images and assets
- Use incremental static regeneration
- Monitor function execution time

### Supabase (Database)
- Monitor database size
- Optimize queries for performance
- Use appropriate pricing tier

## Security Checklist

- [ ] All secrets stored securely (not in code)
- [ ] HTTPS enforced everywhere
- [ ] Rate limiting configured
- [ ] Input validation implemented
- [ ] File upload restrictions in place
- [ ] RLS policies active in database
- [ ] Regular security updates
- [ ] Error messages don't leak sensitive info
- [ ] Monitoring and alerting configured
- [ ] Backup strategy implemented
