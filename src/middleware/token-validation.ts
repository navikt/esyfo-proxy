import { RequestHandler } from 'express';
import { getTokenFromHeader } from '../auth/tokenDings';
import logger from '../logger';
import { createRemoteJWKSet, decodeJwt, jwtVerify } from 'jose';
import { FlattenedJWSInput, GetKeyFunction, JWSHeaderParameters } from 'jose/dist/types/types';
import config from '../config';

let tokenxJWKSet: GetKeyFunction<JWSHeaderParameters, FlattenedJWSInput>;
const getTokenXJwkSet = () => {
    if (!tokenxJWKSet) {
        tokenxJWKSet = createRemoteJWKSet(new URL(config.TOKEN_X_JWKS_URI));
    }

    return tokenxJWKSet;
};

const tokenValidation: RequestHandler = async (req, res, next) => {
    try {
        const token = getTokenFromHeader(req);

        if (!token) {
            logger.warn('Bearer token mangler');
            res.sendStatus(401);
            return;
        }

        const decodedToken = decodeJwt(token);
        logger.info(`decodedToken: ${decodedToken}`);

        const result = await jwtVerify(token, getTokenXJwkSet(), {
            algorithms: ['RS256'],
        });

        logger.info(`Resultat fra tokenx validering: sub=${result.payload.sub} pid=${result.payload.pid}`, result);
        next();
    } catch (err: any) {
        logger.warn(`Feil ved tokenx validering: ${err.message}`);
        next();
    }
};

export default tokenValidation;
