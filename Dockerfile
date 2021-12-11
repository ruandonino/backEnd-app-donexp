FROM node:13

WORKDIR /app

ADD . /app
RUN apt-get update

RUN apt-get install libaio1

RUN apt install unzip
RUN wget https://download.oracle.com/otn_software/linux/instantclient/instantclient-basic-linuxx64.zip && \
    unzip instantclient-basic-linuxx64.zip && \
    rm -f instantclient-basic-linuxx64.zip && \
    cp Wallet_donexp/* instantclient*/network/admin && \
    export TNS_ADMIN=instantclient*/network/admin

RUN npm install


CMD npm start
