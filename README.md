# aia-backend

Backend for AiA

## Utvikling

Bruk Node.js 16.

Du kan bruke [NVM](https://github.com/nvm-sh/nvm) for å sette versjon.
F.eks. `nvm install 16.17.1 && nvm use 16.17.1`

-   klon repo
-   installer avhengigheter `npm i`
-   sett miljøvariabler i `.env`: `cp .env-example .env`
-   start utviklingsserver `npm start`
-   åpne nettleseren på `http://localhost:3000`

## Docker oppsett

Kjør opp med [docker-compose](https://docs.docker.com/compose/)

For å starte: `docker-compose up -d`

For å stoppe: `docker-compose rm -f && docker-compose stop`

## Teste endepunkter lokalt

1. Logg inn på https://www.dev.nav.no
2. Finn cookien `selvbetjening-idtoken`
3. Kopier verdien, og sett den inn i requesten under
4. Kjør `curl` i terminalen eller bruk en REST-klient:

```
curl -vvv 'http://localhost:3000/<endepunkt>' \
  -H $'Cookie: selvbetjening-idtoken=<TOKEN>'
```

## Dokumentasjon

Se swagger dokumentasjon på https://www.dev.nav.no/aia-backend/docs/

# Henvendelser

Spørsmål knyttet til koden eller prosjektet kan stilles via issues her på github.

# For NAV-ansatte

Interne henvendelser kan sendes via Slack i kanalen [#team-paw-dev](https://nav-it.slack.com/archives/CLTFAEW75)

# Lisens

[MIT](LICENSE)
