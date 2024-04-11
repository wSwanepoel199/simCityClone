FROM node:21.1-alpine

COPY package.json /app/package.json
COPY index.html /app/index.html
COPY public/main.css /app/public/main.css
COPY public/favicon.ico /app/public/favicon.ico
COPY public/textures/*.png /app/public/textures/

EXPOSE 5173

WORKDIR /app
RUN npm install