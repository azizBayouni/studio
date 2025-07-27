# Dockerfile

# Stage 1: Install dependencies
FROM node:20-slim AS deps
WORKDIR /app

# Copy package.json and lock file
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install

# Stage 2: Build the application
FROM node:20-slim AS builder
WORKDIR /app

# Copy dependencies from the 'deps' stage
COPY --from=deps /app/node_modules ./node_modules

# Copy the rest of the application source code
COPY . .

# Build the Next.js application
RUN npm run build

# Stage 3: Production runner
FROM node:20-slim AS runner
WORKDIR /app

# Set environment to production
ENV NODE_ENV=production

# Copy built application from the 'builder' stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.ts ./next.config.ts

# The "public" directory is optional in Next.js.
# If you have static assets, create a "public" directory
# and uncomment the following line.
# COPY --from=builder /app/public ./public


# Expose the port the app will run on
EXPOSE 9002

# The command to start the application
CMD ["npm", "start", "--", "-p", "9002"]
