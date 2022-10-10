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
import config from './config';

const PORT = 3000;
const app = express();
const router = express.Router();

app.set('base', config.BASE_PATH);
app.use(cookieParser());
app.use(bodyParser.json());
app.use(pinoHttp({ logger }));
app.use(helmet());
app.use(cors());
router.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

async function setUpRoutes() {
    const { dagpengerTokenDings } = createDependencies();

    router.use(healhApi());
    router.use(unleashApi());
    router.use(ptoProxyApi());
    router.use(dagpengerApi(await dagpengerTokenDings));
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
