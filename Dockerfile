FROM node:20
WORKDIR /app

EXPOSE 3000

COPY package*.json ./
RUN npm install

COPY . .

CMD ["npm", "run", "prisma:init", "&&", "npm", "run", "start:dev"]