import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import helmet from 'helmet';
import cors from 'cors';
import { pinoHttp } from 'pino-http';
import healhApi from './api/health';
import unleashApi from './api/unleash';
import ptoProxyApi from './api/ptoproxy';
import dagpengerApi from './api/dagpenger';
import bodyParser from 'body-parser';
import createDependencies from './tokenx/deps';
import logger from './logger';
import swaggerDocument from './config/swagger';

const PORT = 3000;
const app = express();

app.use(cookieParser());
app.use(bodyParser.json());
app.use(pinoHttp({ logger }));
app.use(helmet());
app.use(cors());
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

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
