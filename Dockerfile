FROM node:17.6-alpine
WORKDIR /pappakeno/blog/frontEnd
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8082
CMD [ "node", "app.js" ]