FROM node:13-alpine3.11

WORKDIR /usr/src/app

COPY *.tar.gz ./

RUN tar -xf *.tar.gz
RUN npm install

EXPOSE 3030
CMD [ "npm", "run", "server" ]