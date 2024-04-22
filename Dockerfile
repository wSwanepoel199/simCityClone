FROM node:21.1-alpine

WORKDIR /app

COPY package.json /app/package.json
COPY index.html /app/index.html
COPY public/main.css /public/main.css
COPY public/favicon.ico /public/favicon.ico
COPY public/textures/*.png /public/textures/
COPY src/* /app/src/

EXPOSE 5173

RUN ["npm", "install"]

CMD ["npm", "run", "start"]
