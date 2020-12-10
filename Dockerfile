FROM node:14.1
ADD app.js /
ADD package.json /
ADD package-lock.json /
RUN npm install
CMD [ "node", "./app.js" ]
