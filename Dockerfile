FROM node:13

WORKDIR /app

ADD . /app

#RUN install wget unzip libaio && \
#    rm -rf /var/cache/yum
RUN apt install unzip
RUN wget https://download.oracle.com/otn_software/linux/instantclient/instantclient-basiclite-linuxx64.zip && \
    unzip instantclient-basiclite-linuxx64.zip && \
    rm -f instantclient-basiclite-linuxx64.zip && \
    cp Wallet_donexp/* instantclient*/network/admin
RUN npm install
RUN ls

CMD npm start
