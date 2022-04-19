NAME = ft_transcendence
SRC = ./docker-compose.yml

${NAME}: all

all:
	docker-compose -f ${SRC} up --build -d

build:
	docker-compose -f ${SRC} build

up:
	docker-compose -f ${SRC} up

down:
	docker-compose -f ${SRC} down

clean:
	docker-compose -f ${SRC} down --rmi all

fclean: clean
	docker system prune --volumes -a -f

re: fclean all
