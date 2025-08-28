# Security Guide for Helpers Platform

## 🔐 Overview

This document outlines security best practices, configurations, and recommendations for the Helpers Platform in production.

## 🛡️ Security Features Implemented

### Authentication & Authorization
- **JWT-based authentication** with Supabase Auth
- **Role-based access control** (Customer, Provider, Admin)
- **Row Level Security (RLS)** in database
- **Token expiration** and refresh mechanism
- **Password hashing** with bcrypt

### API Security
- **Rate limiting** (100 requests per 15 minutes)
- **CORS configuration** with specific origins
- **Request validation** with Zod schemas
- **Security headers** with Helmet.js
- **Input sanitization** and validation

### Database Security
- **PostgreSQL with RLS** policies
- **Prepared statements** to prevent SQL injection
- **Environment variable** encryption
- **Database connection** over SSL

### Infrastructure Security
- **HTTPS enforcement** in production
- **Container security** with non-root users
- **Secret management** via environment variables
- **File upload restrictions** and validation

## 🔧 Security Configuration

### 1. Environment Variables Security

**Development (.env):**
```bash
# Use development keys only
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-dev-service-key
JWT_SECRET=development-secret-key
```

**Production (.env.production):**
```bash
# Use strong, unique production secrets
SUPABASE_URL=https://your-prod-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-prod-service-key
JWT_SECRET=super-secure-256-bit-random-key
```

### 2. Supabase RLS Policies

Ensure these policies are active in your Supabase project:

```sql
-- Users can only access their own data
CREATE POLICY "Users own data" ON public.users
  FOR ALL USING (auth.uid() = id);

-- Providers can only access their bookings
CREATE POLICY "Provider bookings" ON public.bookings
  FOR SELECT USING (
    provider_id IN (
      SELECT id FROM public.providers WHERE user_id = auth.uid()
    )
  );

-- Customers can only access their bookings  
CREATE POLICY "Customer bookings" ON public.bookings
  FOR SELECT USING (customer_id = auth.uid());
```

### 3. API Rate Limiting Configuration

**Current Settings:**
- **Window**: 15 minutes (900,000ms)
- **Max Requests**: 100 per IP
- **Authentication endpoints**: More restrictive (1 req/second)

**Production Recommendations:**
```typescript
// server/src/index.ts
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // More restrictive in production
  message: {
    error: 'Too many requests, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Skip rate limiting for trusted IPs
  skip: (req) => {
    const trustedIPs = ['your-monitoring-service-ip'];
    return trustedIPs.includes(req.ip);
  }
});
```

### 4. CORS Configuration

**Development:**
```typescript
app.use(cors({
  origin: ['http://localhost:3000'],
  credentials: true,
}));
```

**Production:**
```typescript
app.use(cors({
  origin: [
    'https://your-domain.com',
    'https://www.your-domain.com'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
```

### 5. File Upload Security

**Current Implementation:**
```typescript
// Restrict file types and sizes
const upload = multer({
  storage: multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
  }),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx/;
    const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = allowedTypes.test(file.mimetype);
    
    if (mimeType && extName) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});
```

## 🚨 Security Checklist

### Pre-Production Checklist
- [ ] **Environment Variables**: All production secrets are secure and different from development
- [ ] **Database RLS**: Row Level Security policies are enabled and tested
- [ ] **HTTPS**: SSL/TLS certificates are configured and HTTPS is enforced
- [ ] **Rate Limiting**: API rate limiting is configured appropriately for production
- [ ] **CORS**: CORS origins are restricted to production domains only
- [ ] **Input Validation**: All API endpoints validate input with Zod schemas
- [ ] **File Uploads**: File type, size, and location restrictions are in place
- [ ] **Error Handling**: Error messages don't leak sensitive information
- [ ] **Logging**: Security events are logged but sensitive data is not

### Authentication Security
- [ ] **Password Policy**: Minimum 8 characters, complexity requirements
- [ ] **JWT Expiration**: Access tokens expire within 1 hour
- [ ] **Refresh Tokens**: Refresh tokens expire within 7 days
- [ ] **Session Management**: Proper session invalidation on logout
- [ ] **Account Lockout**: Failed login attempt protection
- [ ] **Email Verification**: Email verification required for new accounts

### API Security
- [ ] **Authentication Required**: Protected endpoints require valid JWT
- [ ] **Authorization Checks**: Role-based access control enforced
- [ ] **Input Sanitization**: All user input is sanitized
- [ ] **Output Encoding**: Data is properly encoded in responses
- [ ] **SQL Injection Prevention**: Parameterized queries used everywhere
- [ ] **XSS Prevention**: Content Security Policy headers configured

### Infrastructure Security
- [ ] **Container Security**: Containers run as non-root users
- [ ] **Network Security**: Services communicate over encrypted channels
- [ ] **Secret Management**: Secrets stored in secure vaults, not in code
- [ ] **Monitoring**: Security monitoring and alerting configured
- [ ] **Backups**: Regular encrypted backups with tested restore procedures
- [ ] **Updates**: Regular security updates applied

## 🛠️ Security Tools & Monitoring

### 1. Error Monitoring with Sentry

Add to your production environment:
```bash
npm install @sentry/node @sentry/nextjs
```

**Backend Configuration:**
```typescript
// server/src/config/sentry.ts
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});
```

**Frontend Configuration:**
```typescript
// client/sentry.client.config.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
});
```

### 2. Security Headers (Helmet.js)

**Current Configuration:**
```typescript
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://your-project.supabase.co"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));
```

### 3. Security Scanning

**Automated Security Scanning:**
```bash
# Add to package.json scripts
"security:audit": "npm audit --audit-level=high",
"security:check": "npx audit-ci --moderate",
"security:deps": "npx depcheck"
```

**Manual Security Testing:**
```bash
# Test for common vulnerabilities
npx @lirantal/is-website-vulnerable https://your-domain.com

# Check SSL configuration
npx ssllabs-scan your-domain.com

# Test API security
npx newman run postman/security-tests.json
```

## 🔍 Security Incident Response

### 1. Incident Detection
Monitor for:
- **Unusual login patterns**
- **High error rates**
- **Unauthorized access attempts**
- **Data breach indicators**
- **Performance anomalies**

### 2. Response Procedures

**Immediate Actions:**
1. **Contain**: Isolate affected systems
2. **Assess**: Determine scope and impact
3. **Notify**: Alert relevant stakeholders
4. **Document**: Log all response actions

**Recovery Actions:**
1. **Patch**: Apply security fixes
2. **Reset**: Rotate compromised credentials
3. **Validate**: Test security measures
4. **Monitor**: Enhanced monitoring for recurrence

### 3. Contact Information
- **Security Team**: security@your-domain.com
- **DevOps Team**: devops@your-domain.com
- **Emergency Contact**: +1-xxx-xxx-xxxx

## 📋 Regular Security Maintenance

### Daily
- [ ] Monitor error logs and alerts
- [ ] Review failed authentication attempts
- [ ] Check system health and performance

### Weekly  
- [ ] Review access logs for anomalies
- [ ] Update dependencies with security patches
- [ ] Verify backup integrity

### Monthly
- [ ] Security vulnerability assessment
- [ ] Review and update security policies
- [ ] Test incident response procedures
- [ ] Security training for team members

### Quarterly
- [ ] Comprehensive security audit
- [ ] Penetration testing
- [ ] Review third-party integrations
- [ ] Update security documentation

## 🆘 Emergency Procedures

### Security Breach Response
1. **Immediate containment**
2. **Disable affected accounts/services**
3. **Rotate all secrets and API keys**
4. **Notify users if data is compromised**
5. **Document incident for future prevention**

### Emergency Contacts
```bash
# Disable user account
supabase auth admin delete-user <user-id>

# Revoke API access
flyctl secrets set JWT_SECRET=new-secret-key

# Block IP address (if using Cloudflare)
# Add IP to blocklist via API or dashboard
```

## 📞 Security Resources

### External Security Services
- **Vulnerability Scanning**: Snyk, OWASP ZAP
- **SSL Monitoring**: SSL Labs, Qualys SSL Server Test  
- **Security Headers**: securityheaders.com
- **Domain Monitoring**: VirusTotal, URLVoid

### Security Documentation
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Supabase Security Guide](https://supabase.com/docs/guides/auth/security)
- [Vercel Security Best Practices](https://vercel.com/docs/security)
- [Fly.io Security Features](https://fly.io/docs/security/)

### Compliance Considerations
- **GDPR**: EU data protection regulation
- **CCPA**: California consumer privacy act
- **PCI DSS**: Payment card industry standards (if handling payments)
- **SOC 2**: Security controls framework

Remember: Security is an ongoing process, not a one-time setup. Regular reviews and updates are essential for maintaining a secure platform.
