FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy built application (will be built in GitHub Actions)
COPY .output .output

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S tanstack -u 1001

# Change ownership of the app directory
RUN chown -R tanstack:nodejs /app
USER tanstack

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

# Start the application
CMD ["node", ".output/server/index.mjs"]