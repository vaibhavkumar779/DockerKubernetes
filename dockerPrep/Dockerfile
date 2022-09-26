FROM node:13-alpine

ENV MONGO_DB_USERNAME=admin \
    MONGO_DB_PWD=password

RUN mkdir -p /home/app

COPY ./application /home/application
WORKDIR /home/application

RUN npm install

EXPOSE 3000

CMD ["node", "server.js"]
