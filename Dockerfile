FROM node:16-alpine as builder

ADD / /src
ENV CI=true
WORKDIR /src

RUN npm ci
RUN npm run build

FROM node:16-alpine as runner
WORKDIR /app
COPY --from=builder /src/node_modules /node_modules
COPY --from=builder /src/build /build

ENV NODE_ENV="production"
CMD ["node", "/build/index.js"]

EXPOSE 3000
