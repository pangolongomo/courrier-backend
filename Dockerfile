FROM node:lts-alpine3.23

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate

EXPOSE 4000

CMD npx prisma migrate deploy && npm run start