FROM node:12.18.3

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install

COPY . .
EXPOSE 8080
CMD ["node", "local.js"]
