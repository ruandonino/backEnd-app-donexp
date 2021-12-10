FROM node:13

WORKDIR /app

ADD . /app

RUN rpm install -y wget unzip libaio && \
    rm -rf /var/cache/yum
RUN wget https://download.oracle.com/otn_software/linux/instantclient/instantclient-basiclite-linuxx64.zip && \
    unzip instantclient-basiclite-linuxx64.zip && \
    rm -f instantclient-basiclite-linuxx64.zip && \
    cp Wallet_donexp/* instantclient-basiclite*/instantclient*/network/admin
RUN npm install

CMD npm start
