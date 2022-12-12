import { AutomatiskReaktivering, PrismaClient } from '@prisma/client';
import logger from '../logger';

export interface AutomatiskReaktiveringRepository {
    lagre(bruker: string): Promise<AutomatiskReaktivering>;
    hent(bruker: string): Promise<AutomatiskReaktivering | null>;
}

function createAutomatiskReaktiveringRepository(prismaClient: PrismaClient): AutomatiskReaktiveringRepository {
    return {
        async lagre(bruker: string): Promise<AutomatiskReaktivering> {
            return prismaClient.automatiskReaktivering.create({ data: { bruker_id: bruker } });
        },
        async hent(bruker: string): Promise<AutomatiskReaktivering | null> {
            try {
                return await prismaClient.automatiskReaktivering.findFirst({
                    where: {
                        bruker_id: {
                            equals: bruker,
                        },
                    },
                    orderBy: {
                        id: 'desc',
                    },
                });
            } catch (err) {
                logger.error(`Feil ved henting av automatiskReaktivert: ${err}`);
                throw err;
            }
        },
    };
}

export default createAutomatiskReaktiveringRepository;
