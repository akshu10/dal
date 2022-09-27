FROM node:16-alpine

WORKDIR /app

COPY tsconfig.json ./
COPY package.json ./
COPY yarn.lock ./
COPY server.ts ./
COPY file-service.ts ./


RUN yarn install
RUN yarn build


WORKDIR /app/build

CMD node server.js