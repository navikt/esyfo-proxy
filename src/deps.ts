import createTokenDings, { Auth } from './auth/tokenDings';
import config from './config';
import createProfilRepository, { ProfilRepository } from './db/profilRepository';
import { PrismaClient } from '@prisma/client';
import createBehovRepository, { BehovRepository } from './db/behovForVeiledningRepository';
import createAutomatiskReaktiveringRepository, {
    AutomatiskReaktiveringRepository,
} from './db/automatiskReaktiveringRepository';
import createAutomatiskReaktiveringSvarRepository, {
    AutomatiskReaktiveringSvarRepository,
} from './db/automatiskReaktiveringSvarRepository';

export interface Dependencies {
    tokenDings: Promise<Auth>;
    profilRepository: ProfilRepository;
    behovRepository: BehovRepository;
    automatiskReaktiveringRepository: AutomatiskReaktiveringRepository;
    automatiskReaktiveringSvarRepository: AutomatiskReaktiveringSvarRepository;
}

function createDependencies(): Dependencies {
    const prismaClient = new PrismaClient();

    return {
        tokenDings: createTokenDings({
            tokenXWellKnownUrl: config.TOKEN_X_WELL_KNOWN_URL,
            tokenXClientId: config.TOKEN_X_CLIENT_ID,
            tokenXTokenEndpoint: config.TOKEN_X_TOKEN_ENDPOINT,
            tokenXPrivateJwk: config.TOKEN_X_PRIVATE_JWK,
        }),
        profilRepository: createProfilRepository(prismaClient),
        behovRepository: createBehovRepository(prismaClient),
        automatiskReaktiveringRepository: createAutomatiskReaktiveringRepository(prismaClient),
        automatiskReaktiveringSvarRepository: createAutomatiskReaktiveringSvarRepository(prismaClient),
    };
}

export default createDependencies;
