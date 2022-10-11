import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import cors from 'cors';
import { pinoHttp } from 'pino-http';
import { PrismaClient } from '@prisma/client';
import healhApi from './api/health';
import unleashApi from './api/unleash';
import ptoProxyApi from './api/ptoproxy';
import dagpengerApi from './api/dagpenger';
import meldekortApi from './api/meldekort';
import profilApi from './api/profil';
import swaggerDocs from './api/swagger';
import bodyParser from 'body-parser';
import createDependencies from './tokenx/deps';
import logger from './logger';
import config from './config';

const PORT = 3000;
const prisma = new PrismaClient();
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
    const { tokenDings } = createDependencies();

    router.use(healhApi());
    router.use(unleashApi());
    router.use(ptoProxyApi());
    router.use(swaggerDocs());
    router.use(dagpengerApi(await tokenDings));
    router.use(meldekortApi(await tokenDings));
    router.use(profilApi(prisma));
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
