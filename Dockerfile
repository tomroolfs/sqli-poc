# Stage 1: build
FROM node:18-alpine AS base

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: runner
FROM node:18-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY --from=base /app/package*.json ./
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/.next ./.next
COPY --from=base /app/public ./public
# REMOVED: COPY wait-for-db.sh ./wait-for-db.sh
# REMOVED: RUN chmod +x wait-for-db.sh

EXPOSE 3001

# Run app after DB is ready (guaranteed by docker-compose depends_on)
CMD ["npm", "start"]