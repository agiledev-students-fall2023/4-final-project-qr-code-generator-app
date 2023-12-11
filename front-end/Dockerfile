FROM node:18.18-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

# Final run command
CMD [ "npm", "start" ]