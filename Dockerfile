FROM node:20
WORKDIR /app

EXPOSE 3000

COPY package*.json ./
RUN npm install

COPY . .
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

CMD ["/entrypoint.sh"]