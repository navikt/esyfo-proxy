#!/usr/bin/env sh
export DATABASE_URL=$NAIS_DATABASE_AIA_BACKEND_AIA_BACKEND_URL
npm run prisma:migrate
node ./build/index.js
