FROM node:13-alpine3.11

WORKDIR /usr/src/app

COPY *.tar.gz ./

RUN tar -xf *.tar.gz

EXPOSE 8080
CMD [ "npm", "run", "server" ]