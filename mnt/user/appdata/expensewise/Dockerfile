# 1. Dependency Installation Stage
FROM node:20-slim AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install

# 2. Application Builder Stage
FROM node:20-slim AS builder
WORKDIR /app
# Copy dependencies from the 'deps' stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Build the Next.js application
RUN npm run build

# 3. Final Runner Stage
FROM node:20-slim AS runner
WORKDIR /app

# Set environment to production
ENV NODE_ENV=production

# Create a non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy essential files
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.ts ./next.config.ts
COPY --from=builder /app/.next ./.next

# The 'public' directory is optional in Next.js.
# If you add a 'public' folder later, you can uncomment this line.
# COPY --from=builder /app/public ./public

# Install production dependencies
RUN npm install --production

USER nextjs

# Expose the port the app runs on
EXPOSE 9002

# Command to start the app
CMD ["npm", "start", "--", "-p", "9002"]
