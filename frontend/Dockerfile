FROM node:lts-alpine

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-*.yaml ./

RUN pnpm install --frozen-lockfile

COPY . . 

EXPOSE 3000

CMD ["pnpm", "start"]
