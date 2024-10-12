FROM zenika/alpine-chrome:83-with-node-12

USER root
ENV NODE_ENV=production
WORKDIR /src

COPY package*.json ./
RUN npm install

COPY . .
EXPOSE 8080
CMD ["node" , "index.js"]
