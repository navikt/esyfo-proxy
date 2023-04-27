import { Request, RequestHandler } from 'express';
import { getTokenFromHeader } from '../auth/tokenDings';
import logger from '../logger';
import { createRemoteJWKSet, decodeJwt, jwtVerify } from 'jose';
import { FlattenedJWSInput, GetKeyFunction, JWSHeaderParameters } from 'jose/dist/types/types';
import config from '../config';
import { AuthLevel } from './idporten-authentication';

let tokenxJWKSet: GetKeyFunction<JWSHeaderParameters, FlattenedJWSInput>;
const getTokenXJwkSet = () => {
    if (!tokenxJWKSet) {
        tokenxJWKSet = createRemoteJWKSet(new URL(config.TOKEN_X_JWKS_URI));
    }

    return tokenxJWKSet;
};

export type ValidatedRequest = Request & { user: { level: AuthLevel; ident: string; fnr: string } };

const tokenValidation: RequestHandler = async (req, res, next) => {
    try {
        const token = getTokenFromHeader(req);

        if (!token) {
            logger.warn('Bearer token mangler');
            res.sendStatus(401);
            return;
        }

        const decodedToken = decodeJwt(token);
        // er det nok med decodedToken?
        const result = await jwtVerify(token, getTokenXJwkSet(), {
            algorithms: ['RS256'],
        });

        (req as ValidatedRequest).user = {
            ident: result.payload.sub!,
            fnr: result.payload.pid as string,
            level: decodedToken.acr as AuthLevel,
        };

        next();
    } catch (err: any) {
        logger.warn(`Feil ved tokenx validering: ${err.message}`);
        res.sendStatus(401);
    }
};

export default tokenValidation;
