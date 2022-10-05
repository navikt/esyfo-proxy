import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cookieParser from 'cookie-parser';
import healhApi from './api/health';
import unleashApi from './api/unleash';
import ptoProxyApi from './api/ptoproxy';
import dagpengerApi from './api/dagpenger';
import bodyParser from 'body-parser';
import createDependencies from './tokenx/deps';
import { pinoHttp } from 'pino-http';
import logger from './logger';

const PORT = 3000;
const app = express();
app.use(cookieParser());
app.use(bodyParser.json());
app.use(pinoHttp({ logger }));

async function setUpRoutes() {
    const { dagpengerTokenDings } = createDependencies();

    app.use(healhApi());
    app.use(unleashApi());
    app.use(ptoProxyApi());
    app.use(dagpengerApi(await dagpengerTokenDings));
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
