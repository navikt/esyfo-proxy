import createTokenDings, { Auth } from './auth/tokenDings';
import config from './config';
import createProfilRepository, { ProfilRepository } from './db/profilRepository';
import { PrismaClient } from '@prisma/client';

export interface Dependencies {
    tokenDings: Promise<Auth>;
    profilRepository: ProfilRepository;
}

function createDependencies(): Dependencies {
    const prismaClient = new PrismaClient();

    return {
        tokenDings: createTokenDings({
            tokenXWellKnownUrl: config.TOKEN_X_WELL_KNOWN_URL!,
            tokenXClientId: config.TOKEN_X_CLIENT_ID!,
            tokenXTokenEndpoint: config.TOKEN_X_TOKEN_ENDPOINT!,
            tokenXPrivateJwk: config.TOKEN_X_PRIVATE_JWK!,
            idportenJwksUri: config.IDPORTEN_JWKS_URI!,
        }),
        profilRepository: createProfilRepository(prismaClient),
    };
}

export default createDependencies;
