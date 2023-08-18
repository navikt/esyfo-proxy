import { Request, RequestHandler } from 'express';
import { getTokenFromRequest } from '../auth/tokenDings';
import logger, { getCustomLogProps } from '../logger';
import { createRemoteJWKSet, decodeJwt, JWTPayload, jwtVerify } from 'jose';
import { FlattenedJWSInput, GetKeyFunction, JWSHeaderParameters } from 'jose/dist/types/types';
import config from '../config';

let tokenxJWKSet: GetKeyFunction<JWSHeaderParameters, FlattenedJWSInput>;
const getTokenXJwkSet = () => {
    if (!tokenxJWKSet) {
        tokenxJWKSet = createRemoteJWKSet(new URL(config.TOKEN_X_JWKS_URI));
    }

    return tokenxJWKSet;
};

let idPortenJWKSet: GetKeyFunction<JWSHeaderParameters, FlattenedJWSInput>;
const getIdPortenJwkSet = () => {
    if (!idPortenJWKSet) {
        idPortenJWKSet = createRemoteJWKSet(new URL(config.IDPORTEN_JWKS_URI!));
    }

    return idPortenJWKSet;
};

export type AuthLevel = 'Level3' | 'Level4';
export type ValidatedRequest = Request & { user: { level: AuthLevel; ident: string; fnr: string } };

function isTokenX(decodedToken: JWTPayload) {
    return /tokendings/.test(decodedToken?.iss ?? '');
}

async function verifyToken(token: string, decodedToken: JWTPayload) {
    if (isTokenX(decodedToken)) {
        return await jwtVerify(token, getTokenXJwkSet(), {
            algorithms: ['RS256'],
        });
    } else {
        return await jwtVerify(token, getIdPortenJwkSet(), {
            algorithms: ['RS256'],
        });
    }
}

const tokenValidation: RequestHandler = async (req, res, next) => {
    try {
        const token = getTokenFromRequest(req);

        if (!token) {
            logger.warn(getCustomLogProps(req), 'Bearer token mangler');
            res.sendStatus(401);
            return;
        }

        const decodedToken = decodeJwt(token);
        const result = await verifyToken(token, decodedToken);
        (req as ValidatedRequest).user = {
            ident: result.payload.sub!,
            fnr: result.payload.pid as string,
            level: decodedToken.acr as AuthLevel,
        };
        next();
    } catch (err: any) {
        logger.warn(getCustomLogProps(req), `Feil ved tokenx validering: ${err.message}`);
        res.sendStatus(401);
    }
};

export default tokenValidation;
