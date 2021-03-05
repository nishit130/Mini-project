FROM node:12-slim as ui-build

LABEL maintainer = ["nishitlimbani130@gmail.com"]

WORKDIR /client/


COPY package*.json ./

RUN npm install

COPY . .

CMD [ "npm", "start" ]

EXPOSE 3000
