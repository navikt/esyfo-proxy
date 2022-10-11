#!/bin/bash
export DATABASE_URL=(echo $NAIS_DATABASE_AIA_BACKEND_PROFIL_URL)
node /src/node_modules/prisma/build/index.js migrate dev --schema=/src/prisma/schema.prisma
node ./build/index.js
