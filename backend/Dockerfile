FROM node:20.8-alpine AS builder

WORKDIR /app

COPY . .

RUN npm install

EXPOSE 8000

CMD ["sh", "-c", "npx prisma migrate dev --schema=./src/prisma/schema.prisma && npm run dev"]
