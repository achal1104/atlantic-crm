FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npx prisma generate --schema=prisma/schema.prisma
RUN npm run build

EXPOSE 5000

CMD ["sh", "-c", "npx prisma migrate deploy --schema=prisma/schema.prisma && node dist/src/server.js"]
