import { Client, Issuer } from 'openid-client';
import config from '../config';
import { createRemoteJWKSet, errors, jwtVerify, JWTVerifyResult, ResolvedKey } from 'jose';
import logger from '../logger';
import jwt from 'jsonwebtoken';

let issuer: Issuer<Client>;
const getIssuer = async (): Promise<Issuer<Client>> => {
    if (issuer == null) {
        issuer = await Issuer.discover(config.AZURE_APP_WELL_KNOWN_URL);
    }
    return issuer;
};

let remoteJWKSet: ReturnType<typeof createRemoteJWKSet>;
async function getJwkSet(): Promise<ReturnType<typeof createRemoteJWKSet>> {
    if (remoteJWKSet == null) {
        const issuer = await getIssuer();
        remoteJWKSet = createRemoteJWKSet(new URL(<string>issuer.metadata.jwks_uri));
    }

    return remoteJWKSet;
}

export type ValidationError<ErrorTypes extends string> = {
    errorType: ErrorTypes;
    message: string;
    error?: Error | unknown;
};

export type ValidationResult<ErrorTypes extends string> = 'valid' | ValidationError<ErrorTypes>;

export type VerifyJwt = (JWTVerifyResult & ResolvedKey) | ValidationError<'EXPIRED' | 'UNKNOWN_JOSE_ERROR'>;
async function verifyJwt(
    bearerToken: string,
    jwkSet: ReturnType<typeof createRemoteJWKSet>,
    issuer: Issuer<Client>,
): Promise<VerifyJwt> {
    const token = bearerToken.replace('Bearer ', '');

    try {
        return await jwtVerify(token, jwkSet, {
            issuer: issuer.metadata.issuer,
        });
    } catch (err) {
        if (err instanceof errors.JWTExpired) {
            return {
                errorType: 'EXPIRED',
                message: err.message,
                error: err,
            };
        }

        if (err instanceof errors.JOSEError) {
            return {
                errorType: 'UNKNOWN_JOSE_ERROR',
                message: err.message,
                error: err,
            };
        }

        throw err;
    }
}
export type AzureAdErrorVariants = 'EXPIRED' | 'CLIENT_ID_MISMATCH' | 'UNKNOWN_JOSE_ERROR';
export type AzureAdValidationResult = ValidationResult<AzureAdErrorVariants>;

export async function verifyAzureToken(bearerToken: string) {
    return verifyJwt(bearerToken, await getJwkSet(), await getIssuer());
}
export async function validateAzureToken(bearerToken: string): Promise<AzureAdValidationResult> {
    const verificationResult = await verifyAzureToken(bearerToken);

    if ('errorType' in verificationResult) {
        return verificationResult;
    }

    if (verificationResult.payload.aud !== config.AZURE_APP_CLIENT_ID) {
        return { errorType: 'CLIENT_ID_MISMATCH', message: 'client_id does not match app client_id' };
    }

    return 'valid';
}

const tokenCache = new Map();
const isTokenExpired = (token: string): boolean => {
    try {
        const { exp } = jwt.decode(token) as {
            exp: number;
        };

        const expirationDatetimeInSeconds = exp * 1000;

        return Date.now() >= expirationDatetimeInSeconds;
    } catch {
        return true;
    }
};
export async function getAzureAdToken(
    scope: string,
    azureTokenEndpoint = config.AZURE_OPENID_CONFIG_TOKEN_ENDPOINT,
): Promise<string> {
    const cachedToken = tokenCache.get(scope);
    if (cachedToken && !isTokenExpired(cachedToken)) {
        return cachedToken;
    }

    try {
        // eslint-disable-next-line
        // @ts-ignore
        const response = await fetch(azureTokenEndpoint, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Accept: 'application/json',
            },
            method: 'POST',
            body: new URLSearchParams({
                grant_type: 'client_credentials',
                client_id: config.AZURE_APP_CLIENT_ID,
                client_secret: config.AZURE_APP_CLIENT_SECRET,
                scope,
            }),
        });

        if (!response.ok) {
            throw response;
        }

        logger.info({ message: `Genererer nytt token med scope ${scope}` });

        const token = await response.json();
        tokenCache.set(scope, token.access_token);
        return token.access_token;
    } catch (error) {
        const err = error as Error;
        logger.error({ err }, `Feil ved henting av azure ad token for scope: ${scope}: ${err.message}`);
        throw error;
    }
}
