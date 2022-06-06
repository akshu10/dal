FROM node:16-alpine

WORKDIR /usr/app

COPY tsconfig.json ./
COPY package.json ./
COPY yarn.lock ./
COPY server.ts ./


RUN yarn install
RUN yarn build


WORKDIR /usr/app/build

CMD node server.js