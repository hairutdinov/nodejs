FROM alpine:3.17.1

# Create app directory
WORKDIR /usr/src/app

COPY package*.json ./

RUN apk add --update nodejs npm

RUN npm install

COPY . .

EXPOSE 8101

CMD ['/bin/sh']