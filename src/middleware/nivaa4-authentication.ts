import { RequestHandler } from 'express';
import { IdPortenRequest } from './idporten-authentication';
import logger from '../logger';

const nivaa4Authentication: RequestHandler = (req, res, next) => {
    const authLevel = (req as IdPortenRequest).user?.level;

    if (authLevel !== 'Level4') {
        logger.warn(`Level4 autentisering feiler: ${authLevel}`);
        res.sendStatus(403);
        return;
    }

    next();
};

export default nivaa4Authentication;
