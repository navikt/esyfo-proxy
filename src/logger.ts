import pino from 'pino';
import ecsFormat from '@elastic/ecs-pino-format';

const isProduction = process.env.NODE_ENV === 'production';
const logger = pino(isProduction ? ecsFormat() : undefined);

export default logger;
