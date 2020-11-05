FROM nginx

WORKDIR /usr/share/nginx/html

COPY  *.tar.gz  .

RUN tar -xf *.tar.gz
RUN mv -f build/* .

EXPOSE 80