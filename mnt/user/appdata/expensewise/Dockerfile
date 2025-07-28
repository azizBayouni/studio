
# Stage 1: Builder
#
# This stage builds the Next.js application.
FROM node:18-alpine AS builder
WORKDIR /app

# Copy package.json and package-lock.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application source code
COPY . .

# Build the Next.js application
RUN npm run build

# Stage 2: Runner
#
# This stage creates the final image for running the application.
FROM node:18-alpine AS runner
WORKDIR /app

# Set the environment to production
ENV NODE_ENV=production

# Copy the built application from the builder stage
COPY --from=builder /app/.next ./.next
# The 'public' directory does not exist in this project, so this line is removed.
# COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.ts ./next.config.ts

# Expose the port the app runs on
EXPOSE 9002

# The command to start the application
CMD ["npm", "start", "--", "-p", "9002"]
