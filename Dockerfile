FROM node:21.1-alpine

WORKDIR /app

COPY package.json /
COPY index.html /
COPY public/main.css /public/
COPY public/favicon.ico /public/
COPY public/textures/*.png /public/textures/

EXPOSE 5173

RUN npm install

RUN npm run start
