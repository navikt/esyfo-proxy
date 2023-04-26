import { Request, RequestHandler } from 'express';
import logger from '../logger';
import { createRemoteJWKSet, decodeJwt, jwtVerify } from 'jose';
import { getTokenFromRequest } from '../auth/tokenDings';
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
export type IdPortenRequest = Request & { user: { level: AuthLevel; ident: string; fnr: string } };

const idportenAuthentication: RequestHandler = async (req, res, next) => {
    try {
        const idPortenToken = getTokenFromRequest(req);

        if (!idPortenToken) {
            logger.warn('Bearer token mangler');
            res.sendStatus(401);
            return;
        }

        const decodedToken = decodeJwt(idPortenToken);

        if (/tokendings/.test(decodedToken?.iss ?? '')) {
            // temp
            (req as any).user = {
                level: 'Level4',
            };
            return next();
        }

        const result = await jwtVerify(idPortenToken, getIdPortenJwkSet(), {
            algorithms: ['RS256'],
        });

        (req as IdPortenRequest).user = {
            ident: result.payload.sub!,
            fnr: result.payload.pid as string,
            level: result.payload.acr as AuthLevel,
        };

        next();
    } catch (err: unknown) {
        logger.warn(`Verifisering av token feilet: ${err}`);
        res.sendStatus(401);
    }
};

export default idportenAuthentication;
