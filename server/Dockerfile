# Multi-stage production build for Helpers Platform API
FROM node:18-alpine AS base

# Install security updates and required packages
RUN apk update && apk upgrade && apk add --no-cache curl dumb-init

# Dependencies stage
FROM base AS deps
WORKDIR /app

# Copy package files for dependency installation
COPY package*.json ./
# Install production dependencies
RUN npm ci --only=production && npm cache clean --force

# Builder stage
FROM base AS builder
WORKDIR /app

# Copy package files and shared dependencies
COPY package*.json ./
COPY tsconfig.json ./
# Copy shared utilities
COPY ../shared ../shared/

# Install all dependencies (including dev)
RUN npm ci && npm cache clean --force

# Copy source code
COPY src ./src

# Build the application
RUN npm run build

# Production runtime stage
FROM base AS production

WORKDIR /app

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S helpersapi -u 1001 -G nodejs

# Copy production node_modules
COPY --from=deps --chown=helpersapi:nodejs /app/node_modules ./node_modules
# Copy built application
COPY --from=builder --chown=helpersapi:nodejs /app/dist ./dist
COPY --from=builder --chown=helpersapi:nodejs /app/package*.json ./

# Create required directories with correct permissions
RUN mkdir -p uploads logs tmp && \
    chown -R helpersapi:nodejs uploads logs tmp && \
    chmod 755 uploads logs tmp

# Switch to non-root user
USER helpersapi

# Expose application port
EXPOSE 3001

# Add health check with curl
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3001/health || exit 1

# Use dumb-init for proper signal handling in containers
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/index.js"]
