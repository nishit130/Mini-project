FROM node:12-slim as server-build

WORKDIR /server/

COPY package*.json ./

RUN npm install

COPY . .


EXPOSE 3001
