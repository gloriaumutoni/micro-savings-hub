# Stage 1: Install production dependencies only
FROM node:22-alpine AS deps

WORKDIR /app

# Copy package files and install prod deps
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Stage 2: Final image — clean, non-root, minimal
FROM node:22-alpine

# Create a non-root user and group for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

# Copy only the production node_modules from the deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy application source code
COPY . .

# Run as non-root user
USER appuser

# Expose the application port
EXPOSE 5000

# Health check — wget is available in alpine; curl is not by default
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:5000/health || exit 1

# Start the application
CMD ["node", "app.js"]
