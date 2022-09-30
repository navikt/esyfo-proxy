FROM node:16-alpine

ADD / /src
ENV CI=true
WORKDIR /src

RUN npm ci

RUN npm run build

CMD ["node", "./build/index.js"]

EXPOSE 3000
