# Base on official Node.js Alpine image
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Set build environment
ENV NEXT_TELEMETRY_DISABLED 1
RUN apk add --no-cache openssl1.1-compat

# Install dependencies
COPY package*.json ./
RUN npm ci
# Install required dev dependencies
RUN npm install --save-dev eslint @types/react-google-recaptcha

# Copy source
COPY . .

# Generate Prisma Client and build with increased memory
ENV NODE_OPTIONS="--max-old-space-size=4096"
RUN npx prisma generate
RUN npm run build

# Production image, copy all the files and run next
FROM node:20-alpine AS runner

WORKDIR /app

# Set production environment
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Copy necessary files from builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/next.config.mjs ./

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
RUN chown -R nextjs:nodejs /app
USER nextjs

# Expose port
EXPOSE 3000

# Start the app
CMD ["npm", "run", "start"] 