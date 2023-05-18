FROM node:lts-alpine

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-*.yaml ./

RUN pnpm install --frozen-lockfile

COPY . . 

RUN pnpm dlx prisma migrate dev --name init
RUN pnpm store prune

RUN rm -rf /etc/apk/cache

EXPOSE 3500

CMD ["pnpm", "start"]
