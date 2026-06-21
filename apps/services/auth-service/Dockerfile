# ============================================================================
# auth-service — multi-stage build. Builds from the monorepo root context so
# workspace packages (@jobhunter/*) resolve. Build with:
#   docker build -f apps/services/auth-service/Dockerfile -t jobhunter/auth .
# ============================================================================
FROM node:22-alpine AS base
RUN corepack enable
WORKDIR /repo

# ---- deps ----
FROM base AS deps
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml* ./
COPY tsconfig.base.json ./
COPY packages ./packages
COPY apps/services/auth-service ./apps/services/auth-service
RUN pnpm install --frozen-lockfile=false

# ---- build ----
FROM deps AS build
RUN pnpm --filter @jobhunter/database generate || true
RUN pnpm --filter @jobhunter/auth-service build

# ---- runtime ----
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /repo/node_modules /app/node_modules
COPY --from=build /repo/apps/services/auth-service/dist /app/dist
COPY --from=build /repo/apps/services/auth-service/package.json /app/package.json
EXPOSE 3001
CMD ["node", "dist/main.js"]
