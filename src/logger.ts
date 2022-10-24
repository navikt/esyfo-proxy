import pino from 'pino';
import ecsFormat from '@elastic/ecs-pino-format';
import { IncomingMessage, ServerResponse } from 'http';

const isProduction = process.env.NODE_ENV === 'production';
const logger = pino(isProduction ? ecsFormat() : undefined);

export default logger;

export function customRequestLogMessage(req: IncomingMessage, res: ServerResponse) {
    return `${req.method} ${req.url} completed ${res.statusCode} ${res.statusMessage}`;
}
