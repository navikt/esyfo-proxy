#!/usr/bin/env sh
export DATABASE_URL=$NAIS_DATABASE_AIA_BACKEND_AIA_BACKEND_URL
node /src/node_modules/prisma/build/index.js migrate dev --schema=/src/prisma/schema.prisma
node ./build/index.js
