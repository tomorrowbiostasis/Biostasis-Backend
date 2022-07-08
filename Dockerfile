FROM node:16.10.0

RUN apt-get update && apt-get install -y \
       nano \
       build-essential \
       libssl-dev

RUN mkdir -p /app

COPY . /var/www/backend
WORKDIR /var/www/backend

RUN ls
RUN pwd

EXPOSE 5000

ENV DOCKERIZE_VERSION v0.6.0
RUN wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && tar -C /usr/local/bin -xzvf dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && rm dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz

CMD yarn && yarn typeorm:run && dockerize -wait tcp://biostasis_database:3306 -timeout 60m npm run start:dev
