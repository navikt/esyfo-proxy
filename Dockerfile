FROM node:16-alpine

ADD / /src
ENV CI=true
WORKDIR /src

RUN npm ci

RUN npm run build
ENV PORT=8080

CMD ["node", "./build/index.js"]

EXPOSE $PORT
