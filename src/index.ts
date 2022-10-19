import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import cors from 'cors';
import { pinoHttp } from 'pino-http';
import healhApi from './api/health';
import unleashApi from './api/unleash';
import ptoProxyApi from './api/ptoproxy';
import dagpengerApi from './api/dagpenger';
import meldekortApi from './api/meldekort';
import profilApi from './api/profil';
import arbeidssokerApi from './api/arbeidssoker';
import swaggerDocs from './api/swagger';
import bodyParser from 'body-parser';
import logger from './logger';
import config from './config';
import createDependencies from './deps';

const PORT = 3000;
const app = express();
const router = express.Router();

app.use(cookieParser());
app.use(bodyParser.json());
app.use(
    pinoHttp({
        logger,
        customSuccessMessage: function (req, res) {
            return `${req.method} ${req.url} completed ${res.statusCode} ${res.statusMessage}`;
        },
    })
);
app.use(helmet());
app.use(cors());

async function setUpRoutes() {
    const { tokenDings, profilRepository } = createDependencies();

    router.use(healhApi());
    router.use(unleashApi());
    router.use(ptoProxyApi());
    router.use(swaggerDocs());
    router.use(arbeidssokerApi());
    router.use((await tokenDings).verifyIDPortenToken);
    router.use(dagpengerApi(await tokenDings));
    router.use(meldekortApi(await tokenDings));
    router.use(profilApi(profilRepository));
    app.use(config.BASE_PATH || '', router);
}

const startServer = async () => {
    try {
        await setUpRoutes();
        logger.info(`Starting server...`);
        app.listen(PORT, () => {
            logger.info('Server running at http://localhost:3000');
        });
    } catch (err) {
        logger.error(err);
        process.exit(1);
    }
};

startServer();
