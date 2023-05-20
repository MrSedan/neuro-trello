FROM node:lts-alpine as builder

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-*.yaml ./
COPY prisma ./prisma/
COPY .env ./

RUN pnpm install --frozen-lockfile

COPY . . 

RUN pnpm build
RUN pnpm prune --prod
RUN pnpm store prune

FROM node:lts-alpine

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/build ./
COPY --from=builder /app/package.json /app/pnpm-*.yaml ./
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/.env ./

RUN corepack enable && corepack prepare pnpm@latest --activate
RUN pnpm add -D prisma

RUN rm -rf /etc/apk/cache

EXPOSE 3500

CMD ["pnpm", "start:migrate:prod"]
