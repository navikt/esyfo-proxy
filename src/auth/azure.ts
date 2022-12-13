import { Client, Issuer } from 'openid-client';
import config from '../config';
import { createRemoteJWKSet, errors, jwtVerify, JWTVerifyResult, ResolvedKey } from 'jose';

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

async function verifyJwt(
    bearerToken: string,
    jwkSet: ReturnType<typeof createRemoteJWKSet>,
    issuer: Issuer<Client>
): Promise<(JWTVerifyResult & ResolvedKey) | ValidationError<'EXPIRED' | 'UNKNOWN_JOSE_ERROR'>> {
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

export async function validateAzureToken(bearerToken: string): Promise<AzureAdValidationResult> {
    const verificationResult = await verifyJwt(bearerToken, await getJwkSet(), await getIssuer());

    if ('errorType' in verificationResult) {
        return verificationResult;
    }

    if (verificationResult.payload.aud !== config.AZURE_APP_CLIENT_ID) {
        return { errorType: 'CLIENT_ID_MISMATCH', message: 'client_id does not match app client_id' };
    }

    return 'valid';
}
