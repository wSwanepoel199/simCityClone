FROM node:21.1-alpine

COPY package.json /app/
COPY index.html /app/
COPY public/main.css /app/public/
COPY public/favicon.ico /app/public/
COPY public/textures/*.png /app/public/textures/

EXPOSE 5173

WORKDIR /app
RUN npm install

RUN npm run start
