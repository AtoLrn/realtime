FROM node:20.8-alpine AS builder

WORKDIR /app

COPY . .

RUN npm install

FROM node:20.8 AS dev

WORKDIR /app

ENV NODE_ENV=development

EXPOSE 8000

CMD ["npm", "run", "dev"]
