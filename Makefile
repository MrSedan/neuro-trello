all: run

run:
	docker-compose up -d 

build:
	docker-compose build

run_dev:
	docker-compose -f docker-compose.dev.yml up -d 

build_dev:
	docker-compose -f docker-compose.dev.yml build

restart_dev:
	make down && make run_dev

restart:
	make down && make run

stop:
	docker-compose stop && docker-compose -f docker-compose.dev.yml stop

down:
	docker-compose down && docker-compose -f docker-compose.dev.yml down

migrate:
	cd backend && pnpm exec prisma migrate deploy && pnpm dlx dotenv-cli -e .env.local -- pnpm exec prisma migrate dev && pnpm exec prisma generate

install:
	cd backend && pnpm i --frozen-lockfile && cd ../frontend && pnpm i --frozen-lockfile 