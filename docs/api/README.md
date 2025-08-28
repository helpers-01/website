# Helpers Platform API Documentation

## Overview
This API powers the Helpers platform - an Urban Company clone that connects service providers with customers.

## Base URL
- **Development**: `http://localhost:3001/api`
- **Production**: `https://your-domain.com/api`

## Authentication
All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Rate Limiting
- **Window**: 15 minutes
- **Max Requests**: 100 per IP
- **Headers**: Rate limit info included in response headers

## Response Format
All API responses follow this structure:
```typescript
{
  "success": boolean,
  "message"?: string,
  "data"?: any,
  "error"?: string,
  "metadata"?: {
    "page"?: number,
    "limit"?: number, 
    "total"?: number,
    "totalPages"?: number
  }
}
```

## Endpoints

### Authentication (`/api/auth`)

#### POST `/api/auth/register`
Register a new user account.

**Request Body:**
```typescript
{
  "email": string,
  "password": string,
  "full_name": string,
  "phone"?: string,
  "role": "customer" | "provider" | "admin"
}
```

**Response:** User object with session tokens

#### POST `/api/auth/login`
Authenticate user and get session tokens.

**Request Body:**
```typescript
{
  "email": string,
  "password": string
}
```

**Response:** User object with session tokens

#### POST `/api/auth/logout`
**Protected Route** - Logout user and invalidate tokens.

#### GET `/api/auth/profile`
**Protected Route** - Get current user profile.

#### PUT `/api/auth/profile`
**Protected Route** - Update current user profile.

#### POST `/api/auth/refresh`
Refresh expired access token using refresh token.

### Services (`/api/services`)

#### GET `/api/services`
Get all services with filtering and pagination.

**Query Parameters:**
- `category` - Filter by category ID
- `location` - Filter by service area
- `price_min` - Minimum price filter
- `price_max` - Maximum price filter
- `rating_min` - Minimum rating filter
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)
- `sort_by` - Sort field: price, rating, distance, popularity
- `sort_order` - asc or desc

#### GET `/api/services/categories`
Get all service categories.

#### GET `/api/services/:id`
Get detailed service information with available providers.

#### POST `/api/services` (Admin only)
Create a new service.

#### PUT `/api/services/:id` (Admin only)
Update service information.

#### DELETE `/api/services/:id` (Admin only)
Delete a service.

### Providers (`/api/providers`)

#### GET `/api/providers`
Get all verified providers with pagination.

#### GET `/api/providers/:id`
Get detailed provider profile with services and reviews.

#### POST `/api/providers` (Provider role)
Create provider profile (for users with provider role).

#### PUT `/api/providers/:id` (Provider/Admin)
Update provider profile.

#### GET `/api/providers/:id/availability`
Get provider's availability schedule.

#### PUT `/api/providers/:id/availability` (Provider/Admin)
Update provider's availability.

#### GET `/api/providers/:id/services`
Get services offered by a provider.

#### POST `/api/providers/:id/services` (Provider/Admin)
Add a service to provider's offerings.

### Bookings (`/api/bookings`)

#### GET `/api/bookings`
**Protected Route** - Get user's bookings (customers see their bookings, providers see assigned bookings).

#### POST `/api/bookings`
**Protected Route** - Create a new booking.

#### GET `/api/bookings/:id`
**Protected Route** - Get booking details.

#### PUT `/api/bookings/:id/status`
**Protected Route** - Update booking status (provider/admin only).

#### DELETE `/api/bookings/:id`
**Protected Route** - Cancel booking (customer/admin only).

### Reviews (`/api/reviews`)

#### GET `/api/reviews`
Get reviews with filtering.

#### POST `/api/reviews`
**Protected Route** - Create a review for completed booking.

#### GET `/api/reviews/:id`
Get specific review details.

#### PUT `/api/reviews/:id` (Customer/Admin)
Update review.

#### DELETE `/api/reviews/:id` (Customer/Admin)
Delete review.

### File Upload (`/api/upload`)

#### POST `/api/upload/avatar`
**Protected Route** - Upload user avatar image.

#### POST `/api/upload/service-image`
**Protected Route** - Upload service image (Admin/Provider only).

#### POST `/api/upload/verification-docs`
**Protected Route** - Upload verification documents (Provider only).

## Error Codes

| Code | Description |
|------|-------------|
| `VALIDATION_ERROR` | Request validation failed |
| `UNAUTHORIZED` | Missing or invalid authentication |
| `FORBIDDEN` | Insufficient permissions |
| `NOT_FOUND` | Resource not found |
| `EMAIL_EXISTS` | Email already registered |
| `INVALID_CREDENTIALS` | Invalid login credentials |
| `TOKEN_EXPIRED` | Access token expired |
| `RATE_LIMITED` | Too many requests |
| `SERVER_ERROR` | Internal server error |

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `429` - Too Many Requests
- `500` - Internal Server Error

## Testing
Use the provided Postman collection or test with curl:

```bash
# Register user
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","full_name":"Test User","role":"customer"}'

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```
