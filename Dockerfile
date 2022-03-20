FROM node:17.6-alpine
WORKDIR /pappakeno/blog/backEnd
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8082
CMD [ "node", "src/app.js" ]