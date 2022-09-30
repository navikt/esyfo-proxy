FROM node:16-alpine as builder

ADD / /src
ENV CI=true
WORKDIR /src

RUN npm ci
RUN npm run build

ENV NODE_ENV="production"
CMD ["node", "/build/index.js"]

EXPOSE 3000
