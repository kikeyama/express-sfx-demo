FROM node:14.1

WORKDIR /

COPY index.js /
COPY logger.js /
COPY tracing.js /
COPY grpc_client.js /
COPY package.json /

RUN mkdir pb
RUN wget https://raw.githubusercontent.com/kikeyama/grpc-sfx-demo/master/pb/demo.proto -O ./pb/demo.proto

RUN npm install
CMD [ "node", "./index.js" ]
