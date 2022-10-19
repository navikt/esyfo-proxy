import createTokenDings, { Auth } from './tokenDings';
import config from '../config';

export interface Dependencies {
    tokenDings: Promise<Auth>;
}

function createDependencies(): Dependencies {
    return {
        tokenDings: createTokenDings({
            tokenXWellKnownUrl: config.TOKEN_X_WELL_KNOWN_URL!,
            tokenXClientId: config.TOKEN_X_CLIENT_ID!,
            tokenXTokenEndpoint: config.TOKEN_X_TOKEN_ENDPOINT!,
            tokenXPrivateJwk: config.TOKEN_X_PRIVATE_JWK!,
            idportenJwksUri: config.IDPORTEN_JWKS_URI!,
        }),
    };
}

export default createDependencies;
