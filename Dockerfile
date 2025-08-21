FROM node:24-alpine as builder

ADD / /src
ENV CI=true
WORKDIR /src

RUN chmod +x /src/entrypoint.sh

RUN npm ci
RUN npm run build

USER node

ENV NODE_ENV="production"

ENTRYPOINT ["/src/entrypoint.sh"]

EXPOSE 3000
