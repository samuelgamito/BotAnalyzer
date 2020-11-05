FROM ubuntu:20.04

WORKDIR /usr/src/app

COPY *.tar.gz ./
COPY configure.sh ./

#Preparing ubuntu dependecies
RUN bash configure.sh

EXPOSE 5000

CMD [ "python3", "src/server.py" ]