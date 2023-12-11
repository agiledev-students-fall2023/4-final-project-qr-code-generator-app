FROM node:18.18-alpine

WORKDIR /usr/src/app

COPY package*.json ./

# These extra installations prevent errors with these modules not being included
# Install pkg-config
RUN apk add --no-cache pkgconfig pixman-dev cairo-dev pango-dev
# Install Python
RUN apk add --no-cache python3 make g++
ENV PYTHON /usr/bin/python3

RUN npm install

# Copy everything except contents of dockerignore
COPY . .

EXPOSE 3001

# Final run command
CMD [ "npm", "start" ]