# esyfo-proxy

Brukes som "API gateway" for å utføre [TokenX token-veksling](https://docs.nais.io/auth/tokenx/) for frontender uten egen "frackend". Brukes av våre mikro-frontender og av aktivitetskrav-frontend.

## Utvikling

Bruk Node.js 18.

Du kan bruke [NVM](https://github.com/nvm-sh/nvm) for å sette versjon.
F.eks. `nvm install 18.15.0 && nvm use 18.15.0` eller bare `nvm use`

- klon repo
- installer avhengigheter `npm i`
- sett miljøvariabler i `.env`: `cp .env-example .env`
- start utviklingsserver `npm start`
- åpne nettleseren på `http://localhost:3000`

## Dokumentasjon

Se swagger dokumentasjon på https://www.intern.dev.nav.no/esyfo-proxy/docs/

# Lisens

[MIT](LICENSE)
