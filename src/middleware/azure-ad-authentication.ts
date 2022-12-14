import { NextFunction, Request, RequestHandler, Response } from 'express';
import { validateAzureToken } from '../auth/azure';
import logger from '../logger';

const azureAdAuthentication: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const bearerToken = req.header('Authorization');

    if (bearerToken) {
        const validationResult = await validateAzureToken(bearerToken);
        if (validationResult === 'valid') {
            next();
            return;
        } else {
            logger.error(
                `Feil med azure token-validering: ${validationResult.errorType} ${validationResult.message} (${validationResult.error})`
            );
        }
    }
    res.status(401).end();
};

export default azureAdAuthentication;
