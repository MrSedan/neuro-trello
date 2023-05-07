all: run

run:
	docker-compose up -d 

build:
	docker-compose build

run_dev:
	docker-compose -f docker-compose.dev.yml up -d 

build_dev:
	docker-compose -f docker-compose.dev.yml build

stop:
	docker-compose -f docker-compose.dev.yml stop

down:
	docker-compose -f docker-compose.dev.yml down
