import pino from 'pino';
import { pinoHttp } from 'pino-http';
import ecsFormat from '@elastic/ecs-pino-format';
import { IncomingMessage, ServerResponse } from 'http';
import Config from './config';

const logger = pino({
    ...ecsFormat({ apmIntegration: false }),
    formatters: {
        level: (label: string) => ({ level: label }),
    },
});

export function customRequestLogMessage(req: IncomingMessage, res: ServerResponse) {
    return `${req.method} ${req.url} completed ${res.statusCode} ${res.statusMessage}`;
}

export function getLogLevel(statusCode: number, err?: Error): pino.Level {
    if (statusCode === 401 || statusCode === 403) return 'warn';
    if (statusCode >= 400 || err) return 'error';
    return 'info';
}

export function pinoHttpMiddleware() {
    return pinoHttp({
        autoLogging: {
            ignore: (req) => (req.url ? /internal/.test(req.url) : false),
        },
        customLogLevel: (_, res, err) => getLogLevel(res.statusCode, err),
        logger,
        customSuccessMessage: customRequestLogMessage,
        customErrorMessage: customRequestLogMessage,
        customProps: (req) => ({
            x_callId: req.headers['nav-call-id'],
            x_consumerId: req.headers[Config.CONSUMER_ID_HEADER_NAME],
        }),
    });
}

export default logger;
