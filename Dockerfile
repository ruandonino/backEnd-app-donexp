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
    sh -c "echo instantclient_21_5 > \
      /etc/ld.so.conf.d/oracle-instantclient.conf" && \
    ldconfig && \
    export TNS_ADMIN=instantclient_21_4/network/admin 

RUN npm install


CMD npm start
