import { RequestHandler } from 'express';
import logger, { getCustomLogProps } from '../logger';
import { ValidatedRequest } from './token-validation';

const nivaa4Authentication: RequestHandler = (req, res, next) => {
    const authLevel = (req as ValidatedRequest).user?.level;

    if (authLevel !== 'Level4') {
        logger.warn(getCustomLogProps(req), `Level4 autentisering feiler: ${authLevel}`);
        res.sendStatus(403);
        return;
    }

    next();
};

export default nivaa4Authentication;
