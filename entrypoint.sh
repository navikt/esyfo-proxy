#!/usr/bin/env sh
export DATABASE_URL=$NAIS_DATABASE_AIA_BACKEND_PROFIL_URL
node /src/node_modules/prisma/build/index.js migrate dev --schema=/src/prisma/schema.prisma
npm run prisma:migrate
node ./build/index.js
