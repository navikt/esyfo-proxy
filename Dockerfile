FROM europe-north1-docker.pkg.dev/cgr-nav/pull-through/nav.no/node:24-dev AS builder
WORKDIR /src
ENV CI=true

COPY --chown=node:node package.json package-lock.json ./
RUN npm ci

COPY --chown=node:node . .
RUN npm run build
RUN npm prune --omit=dev
RUN chmod +x ./entrypoint.sh

FROM europe-north1-docker.pkg.dev/cgr-nav/pull-through/nav.no/node:24-slim
WORKDIR /src
ENV NODE_ENV="production"

COPY --from=builder /src/package.json /src/package-lock.json ./
COPY --from=builder /src/node_modules ./node_modules
COPY --from=builder /src/build ./build
COPY --from=builder /src/entrypoint.sh ./entrypoint.sh

USER node

EXPOSE 3000

ENTRYPOINT ["./entrypoint.sh"]
