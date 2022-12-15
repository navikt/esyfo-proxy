import { Request, RequestHandler } from 'express';
import logger from '../logger';
import { createRemoteJWKSet, jwtVerify } from 'jose';
import { getTokenFromCookie } from '../auth/tokenDings';
import config from '../config';
import { FlattenedJWSInput, GetKeyFunction, JWSHeaderParameters } from 'jose/dist/types/types';

let idPortenJWKSet: GetKeyFunction<JWSHeaderParameters, FlattenedJWSInput>;
const getIdPortenJwkSet = () => {
    if (!idPortenJWKSet) {
        idPortenJWKSet = createRemoteJWKSet(new URL(config.IDPORTEN_JWKS_URI!));
    }

    return idPortenJWKSet;
};

export type AuthLevel = 'Level3' | 'Level4';
export type IdPortenRequest = Request & { user: { level: AuthLevel; ident: string } };

const idportenAuthentication: RequestHandler = async (req, res, next) => {
    try {
        const idPortenToken = getTokenFromCookie(req) || req.header('Authorization')?.replace('Bearer ', '');

        if (!idPortenToken) {
            logger.warn('Bearer token mangler');
            res.sendStatus(401);
            return;
        }

        const result = await jwtVerify(idPortenToken, getIdPortenJwkSet(), {
            algorithms: ['RS256'],
        });

        (req as IdPortenRequest).user = {
            ident: result.payload.sub!,
            level: result.payload.acr as AuthLevel,
        };

        next();
    } catch (err: unknown) {
        logger.warn(`Verifisering av token feilet: ${err}`);
        res.sendStatus(401);
    }
};

export default idportenAuthentication;
