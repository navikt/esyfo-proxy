FROM node:16-alpine as builder

ADD / /src
ENV CI=true
WORKDIR /src

RUN npm ci
RUN npm run build

USER node
ENV NODE_ENV="production"
ENTRYPOINT /start.sh

EXPOSE 3000
